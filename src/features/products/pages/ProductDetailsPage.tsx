import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../authentication/hooks/useAuth';
import { saveReview } from '../../customer/services/customerApi';
import { uploadOrderCustomizationImage } from '../../orders/services/orderApi';
import { addProductToCart, type CartCustomizationField, type CartCustomizationOption, type CartCustomRequestItem } from '../../orders/utils/cartStorage';
import { ROUTES } from '../../../shared/constants/routes';
import { resolveMediaUrl } from '../../../shared/utils/mediaUrl';
import * as productApi from '../services/productApi';
import { type Product } from '../types/productTypes';

type FieldValue = {
  value: string;
  selectedChoiceIds: string[];
};

type CustomRequestPoint = CartCustomRequestItem & {
  id: string;
  isUploading?: boolean;
};

export function ProductDetailsPage() {
  const { slug = '' } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [fieldValues, setFieldValues] = useState<Record<string, FieldValue>>({});
  const [customRequest] = useState('');
  const [customRequestItems, setCustomRequestItems] = useState<CustomRequestPoint[]>(() => [createCustomRequestPoint()]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(6);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewCustomerName, setReviewCustomerName] = useState('');
  const [reviewCustomerPhoneNumber, setReviewCustomerPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [error, setError] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        setError('');
        const response = await productApi.getProduct(slug);
        const loadedProduct = response.data;
        if (!loadedProduct) {
          setError('تعذر تحميل المنتج.');
          return;
        }

        setProduct(loadedProduct);
        setSelectedImage((loadedProduct.images.find((image) => image.isPrimary) ?? loadedProduct.images[0])?.imageUrl ?? '');
        setQuantity(loadedProduct.minimumQuantity || 1);
        setSelectedOptions(getDefaultOptions(loadedProduct));
        setFieldValues(getDefaultFieldValues(loadedProduct));
      } catch (caughtError) {
        setError(extractError(caughtError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadProduct();
  }, [slug]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setReviewCustomerName((current) => current || `${user.firstName} ${user.lastName}`.trim());
    setReviewCustomerPhoneNumber((current) => current || user.phoneNumber);
  }, [user]);

  const selection = useMemo(() => {
    if (!product) {
      return { options: [], fields: [], customRequestItems: [], unitPrice: 0, summary: '' };
    }

    return buildSelection(product, selectedOptions, fieldValues, customRequest, customRequestItems);
  }, [product, selectedOptions, fieldValues, customRequest, customRequestItems]);

  function updateFieldValue(fieldId: string, value: Partial<FieldValue>) {
    setFieldValues((current) => ({
      ...current,
      [fieldId]: {
        value: value.value ?? current[fieldId]?.value ?? '',
        selectedChoiceIds: value.selectedChoiceIds ?? current[fieldId]?.selectedChoiceIds ?? [],
      },
    }));
  }

  function updateCustomRequestPoint(id: string, value: Partial<CartCustomRequestItem>) {
    setCustomRequestItems((current) => current.map((item) => (item.id === id ? { ...item, ...value } : item)));
  }

  function addCustomRequestPoint() {
    setCustomRequestItems((current) => [...current, createCustomRequestPoint()]);
  }

  function removeCustomRequestPoint(id: string) {
    setCustomRequestItems((current) => {
      const nextItems = current.filter((item) => item.id !== id);
      return nextItems.length > 0 ? nextItems : [createCustomRequestPoint()];
    });
  }

  async function uploadCustomRequestImage(id: string, file?: File) {
    if (!file) {
      return;
    }

    setCustomRequestItems((current) => current.map((item) => (item.id === id ? { ...item, isUploading: true } : item)));
    try {
      const uploaded = await uploadOrderCustomizationImage(file);
      updateCustomRequestPoint(id, { imageUrl: uploaded.url });
      setError('');
    } catch (caughtError) {
      setError(extractError(caughtError));
    } finally {
      setCustomRequestItems((current) => current.map((item) => (item.id === id ? { ...item, isUploading: false } : item)));
    }
  }

  function handleAddToCart() {
    if (!product) {
      return;
    }

    if (quantity < product.minimumQuantity || (product.maximumQuantity != null && quantity > product.maximumQuantity)) {
      setError(product.maximumQuantity == null
        ? `أقل كمية للطلب هي ${product.minimumQuantity}.`
        : `الكمية يجب أن تكون بين ${product.minimumQuantity} و ${product.maximumQuantity}.`);
      return;
    }

    const validationErrors = validateProductSelection(product, selectedOptions, fieldValues);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      return;
    }

    addProductToCart(product, {
      quantity,
      selectedOptions: selection.options,
      customFields: selection.fields,
      customRequest,
      customRequestItems: selection.customRequestItems,
      unitPrice: selection.unitPrice,
      customizationSummary: selection.summary,
    });
    setMessage('تمت إضافة المنتج للسلة مع تفاصيل التخصيص.');
    setError('');
  }

  async function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!product) {
      return;
    }

    if (!isAuthenticated && (!reviewCustomerName.trim() || !reviewCustomerPhoneNumber.trim())) {
      setReviewError('اكتب الاسم ورقم الهاتف قبل إرسال التقييم.');
      return;
    }

    setIsReviewSubmitting(true);
    setReviewError('');
    setReviewMessage('');

    try {
      await saveReview({
        productId: product.id,
        rating,
        comment: reviewComment,
        customerName: reviewCustomerName.trim(),
        customerPhoneNumber: reviewCustomerPhoneNumber.trim(),
      });
      setReviewMessage('تم حفظ تقييمك. سيظهر للزوار بعد مراجعة صاحب المتجر.');
      setReviewComment('');
      setRating(6);
    } catch (caughtError) {
      setReviewError(extractError(caughtError));
    } finally {
      setIsReviewSubmitting(false);
    }
  }

  if (isLoading) {
    return <main className="shop-page"><div className="loading-state"><span /> جار تحميل المنتج...</div></main>;
  }

  if (!product) {
    return (
      <main className="shop-page">
        <p className="empty-state">{error || 'المنتج غير موجود.'}</p>
      </main>
    );
  }

  const selectedImageUrl = selectedImage || product.images[0]?.imageUrl || '';
  const total = selection.unitPrice * quantity;

  return (
    <main className="shop-page product-details-page">
      <nav className="product-breadcrumb">
        <Link to={ROUTES.products}>المنتجات</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <section className="product-details-layout">
        <div className="product-gallery">
          <div className="product-main-image">
            {selectedImageUrl ? <img src={resolveMediaUrl(selectedImageUrl)} alt={product.name} decoding="async" /> : <span className="shop-product-placeholder" />}
          </div>
          {product.images.length > 1 ? (
            <div className="product-thumbs">
              {product.images.map((image) => (
                <button
                  className={selectedImage === image.imageUrl ? 'active' : ''}
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImage(image.imageUrl)}
                >
                  <img src={resolveMediaUrl(image.imageUrl)} alt={image.altText || product.name} loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="product-details-panel">
          <small>{product.category.name}</small>
          <h1>{product.name}</h1>
          {product.description || product.shortDescription ? <p>{product.description || product.shortDescription}</p> : null}
          <strong className="product-detail-price">{product.priceLabel || `${selection.unitPrice.toLocaleString('ar')} شيكل`}</strong>
          {product.preparationNote ? <p className="product-prep-note">{product.preparationNote}</p> : null}

          <section className="product-choice-stack">
            {product.optionGroups.map((group) => (
              <fieldset className="product-choice-group" key={group.id}>
                <legend>
                  {group.name}
                  {group.isRequired ? <span>مطلوب</span> : null}
                </legend>
                {group.description ? <p>{group.description}</p> : null}
                <div className="choice-grid">
                  {group.values.map((value) => (
                    <label className={selectedOptions[group.id] === value.id ? 'choice-pill active' : 'choice-pill'} key={value.id}>
                      <input
                        checked={selectedOptions[group.id] === value.id}
                        name={group.id}
                        type="radio"
                        value={value.id}
                        onChange={() => setSelectedOptions((current) => ({ ...current, [group.id]: value.id }))}
                      />
                      <span>{value.label}</span>
                      {value.extraPrice > 0 ? <small>+ {value.extraPrice.toLocaleString('ar')} شيكل</small> : null}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            {product.customizationFields.map((field) => (
              <label className="field admin-field product-custom-field" key={field.id}>
                <span>
                  {field.label}
                  {field.isRequired ? <b>مطلوب</b> : null}
                </span>
                {field.description ? <small>{field.description}</small> : null}
                <CustomizationFieldControl field={field} value={fieldValues[field.id]} onChange={(value) => updateFieldValue(field.id, value)} />
              </label>
            ))}

            <section className="product-custom-request-list">
              <div>
                <span>طلبات تخصيص إضافية من عندك</span>
                <small>أضف كل فكرة أو ملاحظة كنقطة منفصلة، ويمكن إرفاق صورة مع كل نقطة.</small>
              </div>
              {customRequestItems.map((item, index) => (
                <div className="custom-request-item" key={item.id}>
                  <label className="field admin-field">
                    نقطة {index + 1}
                    <textarea rows={3} value={item.text} placeholder="مثال: الاسم بخط ناعم، أو صورة مرجعية للّون" onChange={(event) => updateCustomRequestPoint(item.id, { text: event.target.value })} />
                  </label>
                  <label className="file-picker-inline custom-request-file">
                    رفع صورة
                    <input accept="image/*" type="file" onChange={(event) => void uploadCustomRequestImage(item.id, event.target.files?.[0])} />
                    <span>{item.isUploading ? 'جاري الرفع...' : item.imageUrl ? 'تم رفع الصورة' : 'اختيار صورة'}</span>
                  </label>
                  {item.imageUrl ? <img className="custom-request-preview" src={resolveMediaUrl(item.imageUrl)} alt={`تخصيص ${index + 1}`} loading="lazy" decoding="async" /> : null}
                  <button className="text-button danger" type="button" onClick={() => removeCustomRequestPoint(item.id)}>حذف النقطة</button>
                </div>
              ))}
              <button className="button button-secondary" type="button" onClick={addCustomRequestPoint}>إضافة نقطة</button>
            </section>
          </section>

          <section className="product-purchase-box">
            <label className="field admin-field">
              الكمية
              <input
                max={product.maximumQuantity ?? undefined}
                min={product.minimumQuantity}
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </label>
            <div>
              <span>الإجمالي التقريبي</span>
              <strong>{total.toLocaleString('ar')} شيكل</strong>
            </div>
            {selection.summary ? <p>{selection.summary}</p> : null}
            {error ? <div className="form-error">{error}</div> : null}
            {message ? <div className="form-success">{message}</div> : null}
            <button className="button button-primary" type="button" disabled={!product.allowOrdering} onClick={handleAddToCart}>
              {product.allowOrdering ? 'إضافة للسلة' : 'غير متاح للطلب'}
            </button>
            <Link className="button button-secondary" to={ROUTES.cart}>الذهاب للسلة</Link>
          </section>
        </div>
      </section>

      <section className="product-review-section">
        <div>
          <p className="eyebrow">التقييم</p>
          <h2>قيّم المنتج</h2>
          <p>شارك تجربتك مع المنتج من نفس الصفحة.</p>
        </div>
        <form className="customer-panel form-stack" onSubmit={handleReviewSubmit}>
          {reviewError ? <div className="form-error">{reviewError}</div> : null}
          {reviewMessage ? <div className="form-success">{reviewMessage}</div> : null}
          {!isAuthenticated ? (
            <div className="form-grid">
              <label className="field admin-field">
                الاسم
                <input value={reviewCustomerName} onChange={(event) => setReviewCustomerName(event.target.value)} />
              </label>
              <label className="field admin-field">
                رقم الهاتف
                <input dir="ltr" value={reviewCustomerPhoneNumber} onChange={(event) => setReviewCustomerPhoneNumber(event.target.value)} />
              </label>
            </div>
          ) : null}
          <div className="rose-rating-field">
            <span>التقييم</span>
            <div className="rose-rating-options" role="radiogroup" aria-label="التقييم بالورود">
              {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                <button className={rating === value ? 'active' : ''} key={value} type="button" aria-pressed={rating === value} onClick={() => setRating(value)}>
                  <span>{value === 0 ? '0' : 'وردة'.repeat(value)}</span>
                  <small>{value}</small>
                </button>
              ))}
            </div>
          </div>
          <label className="field admin-field">
            ملاحظتك
            <textarea rows={4} value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} />
          </label>
          <button className="button button-primary" type="submit" disabled={isReviewSubmitting || !reviewComment.trim()}>
            {isReviewSubmitting ? 'جار الحفظ...' : 'حفظ التقييم'}
          </button>
        </form>
      </section>
    </main>
  );
}

function CustomizationFieldControl({
  field,
  value,
  onChange,
}: {
  field: Product['customizationFields'][number];
  value?: FieldValue;
  onChange: (value: Partial<FieldValue>) => void;
}) {
  const currentValue = value?.value ?? '';
  const selectedChoiceIds = value?.selectedChoiceIds ?? [];

  if (field.type === 'longText') {
    return <textarea maxLength={field.maxLength ?? undefined} minLength={field.minLength ?? undefined} rows={4} value={currentValue} placeholder={field.placeholder} onChange={(event) => onChange({ value: event.target.value })} />;
  }

  if (field.type === 'singleSelect') {
    return (
      <select value={selectedChoiceIds[0] ?? ''} onChange={(event) => onChange({ selectedChoiceIds: event.target.value ? [event.target.value] : [], value: event.target.value })}>
        <option value="">اختر خيار</option>
        {field.choices.map((choice) => (
          <option key={choice.id} value={choice.id}>{choice.label}{choice.additionalPrice > 0 ? ` + ${choice.additionalPrice} شيكل` : ''}</option>
        ))}
      </select>
    );
  }

  if (field.type === 'multiSelect') {
    return (
      <div className="choice-grid">
        {field.choices.map((choice) => {
          const isChecked = selectedChoiceIds.includes(choice.id);
          return (
            <label className={isChecked ? 'choice-pill active' : 'choice-pill'} key={choice.id}>
              <input
                checked={isChecked}
                type="checkbox"
                onChange={(event) => {
                  const nextIds = event.target.checked
                    ? [...selectedChoiceIds, choice.id]
                    : selectedChoiceIds.filter((choiceId) => choiceId !== choice.id);
                  onChange({ selectedChoiceIds: nextIds, value: nextIds.join(',') });
                }}
              />
              <span>{choice.label}</span>
              {choice.additionalPrice > 0 ? <small>+ {choice.additionalPrice.toLocaleString('ar')} شيكل</small> : null}
            </label>
          );
        })}
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label className="checkbox-line">
        <input checked={currentValue === 'true'} type="checkbox" onChange={(event) => onChange({ value: event.target.checked ? 'true' : '' })} />
        <span>نعم</span>
      </label>
    );
  }

  return (
    <input
      max={field.type === 'number' ? field.maxValue ?? undefined : undefined}
      maxLength={field.type !== 'number' ? field.maxLength ?? undefined : undefined}
      min={field.type === 'number' ? field.minValue ?? undefined : undefined}
      minLength={field.type !== 'number' ? field.minLength ?? undefined : undefined}
      type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
      value={currentValue}
      placeholder={field.placeholder}
      onChange={(event) => onChange({ value: event.target.value })}
    />
  );
}

function getDefaultOptions(product: Product) {
  return Object.fromEntries(
    product.optionGroups.map((group) => [
      group.id,
      group.values.find((value) => value.isDefault)?.id ?? (group.isRequired ? group.values[0]?.id ?? '' : ''),
    ]),
  );
}

function getDefaultFieldValues(product: Product) {
  return Object.fromEntries(
    product.customizationFields.map((field) => [field.id, { value: '', selectedChoiceIds: [] }]),
  );
}

function buildSelection(
  product: Product,
  selectedOptionIds: Record<string, string>,
  fieldValues: Record<string, FieldValue>,
  customRequest: string,
  customRequestItems: CustomRequestPoint[],
) {
  const options = product.optionGroups.flatMap<CartCustomizationOption>((group) => {
    const value = group.values.find((item) => item.id === selectedOptionIds[group.id]);
    return value
      ? [{
        groupId: group.id,
        groupName: group.name,
        valueId: value.id,
        valueLabel: value.label,
        extraPrice: value.extraPrice,
      }]
      : [];
  });

  const fields = product.customizationFields.flatMap<CartCustomizationField>((field) => {
    const current = fieldValues[field.id] ?? { value: '', selectedChoiceIds: [] };
    const choices = field.choices.filter((choice) => current.selectedChoiceIds.includes(choice.id));
    const displayValue = choices.length > 0
      ? choices.map((choice) => choice.label).join('، ')
      : field.type === 'checkbox' && current.value === 'true'
        ? 'نعم'
        : current.value.trim();

    if (!displayValue) {
      return [];
    }

    return [{
      fieldId: field.id,
      fieldLabel: field.label,
      fieldType: field.type,
      value: current.value,
      selectedChoiceIds: current.selectedChoiceIds,
      displayValue,
      additionalPrice: field.additionalPrice + choices.reduce((sum, choice) => sum + choice.additionalPrice, 0),
    }];
  });

  const unitPrice = (product.basePrice ?? 0)
    + options.reduce((sum, option) => sum + option.extraPrice, 0)
    + fields.reduce((sum, field) => sum + field.additionalPrice, 0);
  const requestItems = customRequestItems
    .map((item) => ({ text: item.text.trim(), imageUrl: item.imageUrl?.trim() ?? '' }))
    .filter((item) => item.text || item.imageUrl);
  const summary = [
    ...options.map((option) => `${option.groupName}: ${option.valueLabel}`),
    ...fields.map((field) => `${field.fieldLabel}: ${field.displayValue}`),
    customRequest.trim() ? `طلب خاص: ${customRequest.trim()}` : '',
    ...requestItems.map((item, index) => `طلب خاص ${index + 1}: ${item.text || 'صورة مرفقة'}${item.imageUrl ? ' + صورة' : ''}`),
  ].filter(Boolean).join(' | ');

  return { options, fields, customRequestItems: requestItems, unitPrice, summary };
}

function validateProductSelection(
  product: Product,
  selectedOptionIds: Record<string, string>,
  fieldValues: Record<string, FieldValue>,
) {
  const errors: string[] = [];

  product.optionGroups.forEach((group) => {
    if (group.isRequired && !selectedOptionIds[group.id]) {
      errors.push(`اختر ${group.name}.`);
    }
  });

  product.customizationFields.forEach((field) => {
    const current = fieldValues[field.id] ?? { value: '', selectedChoiceIds: [] };
    const hasValue = current.value.trim().length > 0 || current.selectedChoiceIds.length > 0;

    if (field.isRequired && !hasValue) {
      errors.push(`حقل ${field.label} مطلوب.`);
    }

    if (field.minLength && current.value && current.value.length < field.minLength) {
      errors.push(`حقل ${field.label} قصير.`);
    }

    if (field.maxLength && current.value.length > field.maxLength) {
      errors.push(`حقل ${field.label} طويل.`);
    }
  });

  return errors;
}

function createCustomRequestPoint(): CustomRequestPoint {
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text: '',
    imageUrl: '',
  };
}

function extractError(error: unknown): string {
  if (typeof error === 'object' && error && 'errors' in error && Array.isArray((error as { errors: unknown }).errors)) {
    return ((error as { errors: string[] }).errors).join(' ');
  }

  if (typeof error === 'object' && error && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }

  return 'حدث خطأ غير متوقع. حاول مرة أخرى.';
}
