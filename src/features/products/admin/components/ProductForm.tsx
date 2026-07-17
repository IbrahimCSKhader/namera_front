import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { type ProductCategory } from '../../types/productTypes';
import { resolveMediaUrl } from '../../../../shared/utils/mediaUrl';
import {
  type ProductCustomizationFieldDraft,
  type ProductDraft,
  type ProductFieldErrors,
  type ProductImageDraft,
  type ProductOptionGroupDraft,
  type ProductOptionValueDraft,
} from '../types/productAdminTypes';
import { calculateProductPricingSummary, createEmptyImage, createId } from '../utils/productDraft';

type ProductFormProps = {
  draft: ProductDraft;
  categories: ProductCategory[];
  errors: ProductFieldErrors;
  isSaving: boolean;
  submitLabel: string;
  onChange: (draft: ProductDraft) => void;
  onSubmit: () => void;
  onCreateCategory: (name: string, imageFile?: File | null) => Promise<void>;
  onUploadProductImage: (file: File) => Promise<string>;
};

export function ProductForm({
  draft,
  categories,
  errors,
  isSaving,
  submitLabel,
  onChange,
  onSubmit,
  onCreateCategory,
  onUploadProductImage,
}: ProductFormProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);
  const pricing = useMemo(() => calculateProductPricingSummary(draft), [draft]);
  const isMediaBusy = isCreatingCategory || uploadingImageId !== null;

  function update<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    onChange({ ...draft, [key]: value });
  }

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) {
      return;
    }

    setIsCreatingCategory(true);
    try {
      await onCreateCategory(newCategoryName.trim(), newCategoryImage);
      setNewCategoryName('');
      setNewCategoryImage(null);
    } finally {
      setIsCreatingCategory(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="owner-product-form" onSubmit={handleSubmit}>
      <BasicInfoSection
        categories={categories}
        draft={draft}
        errors={errors}
        newCategoryName={newCategoryName}
        newCategoryImage={newCategoryImage}
        isCreatingCategory={isCreatingCategory}
        onCreateCategory={handleCreateCategory}
        onNewCategoryImageChange={setNewCategoryImage}
        onNewCategoryNameChange={setNewCategoryName}
        update={update}
      />
      <ImagesSection
        draft={draft}
        errors={errors}
        uploadingImageId={uploadingImageId}
        onChange={onChange}
        onUploadProductImage={onUploadProductImage}
        onUploadingImageChange={setUploadingImageId}
      />
      <PricingSection draft={draft} pricingLabel={pricing.priceLabel} update={update} />
      <OptionsSection draft={draft} onChange={onChange} />
      <CustomizationSection draft={draft} onChange={onChange} />
      <InventorySection draft={draft} update={update} />
      <VisibilitySection draft={draft} update={update} />
      <PreviewSection draft={draft} pricingLabel={pricing.priceLabel} />

      {Object.keys(errors).length > 0 ? (
        <div className="form-error">
          <p>راجعي الحقول المعلّمة قبل الحفظ.</p>
        </div>
      ) : null}

      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={isSaving || isMediaBusy}>
          {uploadingImageId ? 'انتظري اكتمال رفع الصورة...' : isSaving ? 'جار الحفظ...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

type SectionProps = {
  draft: ProductDraft;
  errors?: ProductFieldErrors;
  update?: <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => void;
  onChange?: (draft: ProductDraft) => void;
};

function BasicInfoSection({
  categories,
  draft,
  errors,
  newCategoryName,
  newCategoryImage,
  isCreatingCategory,
  update,
  onCreateCategory,
  onNewCategoryImageChange,
  onNewCategoryNameChange,
}: SectionProps & {
  categories: ProductCategory[];
  newCategoryName: string;
  newCategoryImage: File | null;
  isCreatingCategory: boolean;
  onCreateCategory: () => void;
  onNewCategoryImageChange: (file: File | null) => void;
  onNewCategoryNameChange: (value: string) => void;
  update: <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => void;
}) {
  return (
    <section className="form-section">
      <div className="section-kicker">01</div>
      <div>
        <h2>المعلومات الأساسية</h2>
        <div className="form-grid">
          <Field label="اسم المنتج" error={errors?.name?.[0]}>
            <input value={draft.name} maxLength={120} onChange={(event) => update('name', event.target.value)} />
          </Field>
          <Field label="رابط المنتج">
            <input value={draft.slug} placeholder="يُولّد تلقائيًا عند تركه فارغًا" onChange={(event) => update('slug', event.target.value)} />
          </Field>
          <Field label="التصنيف" error={errors?.categoryId?.[0]}>
            <select value={draft.categoryId} onChange={(event) => update('categoryId', event.target.value)}>
              <option value="">اختاري التصنيف</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="حالة المنتج">
            <select value={draft.status} onChange={(event) => update('status', event.target.value as ProductDraft['status'])}>
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
              <option value="hidden">مخفي</option>
              <option value="unavailable">غير متوفر</option>
              <option value="archived">مؤرشف</option>
            </select>
          </Field>
        </div>
        <div className="inline-create">
          <input value={newCategoryName} placeholder="تصنيف جديد" onChange={(event) => onNewCategoryNameChange(event.target.value)} />
          <label className="file-picker-inline">
            صورة التصنيف
            <input accept="image/*" type="file" onChange={(event) => onNewCategoryImageChange(event.target.files?.[0] ?? null)} />
            <span>{newCategoryImage?.name ?? 'اختيار صورة'}</span>
          </label>
          <button className="button button-secondary" type="button" disabled={isCreatingCategory} onClick={onCreateCategory}>
            {isCreatingCategory ? 'جار الإضافة...' : 'إضافة تصنيف'}
          </button>
        </div>
        <Field label="وصف مختصر">
          <input value={draft.shortDescription} onChange={(event) => update('shortDescription', event.target.value)} />
        </Field>
        <Field label="الوصف الكامل">
          <textarea rows={7} value={draft.description} onChange={(event) => update('description', event.target.value)} />
        </Field>
      </div>
    </section>
  );
}

function ImagesSection({
  draft,
  errors,
  uploadingImageId,
  onChange,
  onUploadProductImage,
  onUploadingImageChange,
}: SectionProps & {
  onChange: (draft: ProductDraft) => void;
  onUploadProductImage: (file: File) => Promise<string>;
  onUploadingImageChange: (imageId: string | null) => void;
  uploadingImageId: string | null;
}) {
  function updateImage(index: number, image: ProductImageDraft) {
    const images = draft.images.map((item, itemIndex) => (itemIndex === index ? image : item));
    onChange({ ...draft, images });
  }

  function markPrimary(index: number) {
    onChange({
      ...draft,
      images: draft.images.map((image, imageIndex) => ({ ...image, isPrimary: imageIndex === index })),
    });
  }

  async function uploadImage(index: number, file: File) {
    const image = draft.images[index];
    if (!image) {
      return;
    }

    onUploadingImageChange(image.id);
    try {
      const imageUrl = await onUploadProductImage(file);
      updateImage(index, {
        ...image,
        imageUrl,
        altText: image.altText || file.name.replace(/\.[^.]+$/, ''),
        fileName: file.name,
      });
    } finally {
      onUploadingImageChange(null);
    }
  }

  return (
    <section className="form-section">
      <div className="section-kicker">02</div>
      <div>
        <h2>صور المنتج</h2>
        {errors?.['images.primary'] ? <p className="field-error">{errors['images.primary'][0]}</p> : null}
        <div className="image-editor-grid">
          {draft.images.map((image, index) => (
            <article className="image-editor" key={image.id}>
              <div className="image-preview">{image.imageUrl ? <img src={resolveMediaUrl(image.imageUrl)} alt={image.altText || draft.name} /> : <span>معاينة</span>}</div>
              <label className="file-picker-card">
                <input accept="image/*" type="file" onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void uploadImage(index, file);
                  }
                }} />
                <span>{uploadingImageId === image.id ? 'جار رفع الصورة...' : image.fileName || 'اختيار صورة من الجهاز'}</span>
              </label>
              <input value={image.altText} placeholder="النص البديل" onChange={(event) => updateImage(index, { ...image, altText: event.target.value })} />
              <div className="row-actions">
                <button className="text-button" type="button" onClick={() => markPrimary(index)}>
                  {image.isPrimary ? 'صورة رئيسية' : 'تعيين رئيسية'}
                </button>
                <button className="text-button danger" type="button" onClick={() => onChange({ ...draft, images: draft.images.filter((item) => item.id !== image.id) })}>
                  حذف
                </button>
              </div>
            </article>
          ))}
        </div>
        <button className="button button-secondary" type="button" onClick={() => onChange({ ...draft, images: [...draft.images, createEmptyImage(false)] })}>
          إضافة صورة
        </button>
      </div>
    </section>
  );
}

function PricingSection({ draft, pricingLabel, update }: SectionProps & { pricingLabel: string; update: <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => void }) {
  return (
    <section className="form-section">
      <div className="section-kicker">03</div>
      <div>
        <h2>طريقة التسعير</h2>
        <div className="form-grid">
          <Field label="نوع السعر">
            <select value={draft.pricingType} onChange={(event) => update('pricingType', event.target.value as ProductDraft['pricingType'])}>
              <option value="fixed">سعر ثابت</option>
              <option value="startingFrom">السعر يبدأ من</option>
              <option value="optionsBased">حسب الخيارات</option>
              <option value="quote">السعر عند الطلب</option>
            </select>
          </Field>
          <Field label="السعر الأساسي">
            <input
              min="0"
              step="0.01"
              type="number"
              value={draft.basePrice ?? ''}
              disabled={draft.pricingType === 'quote'}
              onChange={(event) => update('basePrice', event.target.value === '' ? null : Number(event.target.value))}
            />
          </Field>
          <label className="toggle-field">
            <input checked={draft.isPriceVisible} type="checkbox" onChange={(event) => update('isPriceVisible', event.target.checked)} />
            السعر ظاهر للعميل
          </label>
          <Field label="عبارة السعر">
            <input value={draft.priceLabel} placeholder="السعر عند الطلب" onChange={(event) => update('priceLabel', event.target.value)} />
          </Field>
        </div>
        <div className="price-chip">المعاينة: {pricingLabel}</div>
      </div>
    </section>
  );
}

function OptionsSection({ draft, onChange }: SectionProps & { onChange: (draft: ProductDraft) => void }) {
  function updateGroup(index: number, group: ProductOptionGroupDraft) {
    onChange({ ...draft, hasVariants: true, optionGroups: draft.optionGroups.map((item, itemIndex) => (itemIndex === index ? group : item)) });
  }

  function createGroup(): ProductOptionGroupDraft {
    return {
      id: createId('group'),
      name: '',
      description: '',
      isRequired: true,
      displayOrder: draft.optionGroups.length + 1,
      isActive: true,
      values: [],
    };
  }

  function createValue(group: ProductOptionGroupDraft): ProductOptionValueDraft {
    return {
      id: createId('value'),
      label: '',
      extraPrice: 0,
      displayOrder: group.values.length + 1,
      isActive: true,
      isDefault: group.values.length === 0,
      stockQuantity: null,
      sku: '',
      imageUrl: '',
    };
  }

  return (
    <section className="form-section">
      <div className="section-kicker">04</div>
      <div>
        <h2>الأحجام والخيارات</h2>
        <label className="toggle-field">
          <input checked={draft.hasVariants} type="checkbox" onChange={(event) => onChange({ ...draft, hasVariants: event.target.checked })} />
          يحتوي المنتج على خيارات أو متغيرات
        </label>
        {draft.optionGroups.map((group, groupIndex) => (
          <article className="nested-editor" key={group.id}>
            <div className="form-grid">
              <Field label="اسم المجموعة">
                <input value={group.name} placeholder="مثال: الحجم" onChange={(event) => updateGroup(groupIndex, { ...group, name: event.target.value })} />
              </Field>
              <Field label="ترتيب الظهور">
                <input type="number" value={group.displayOrder} onChange={(event) => updateGroup(groupIndex, { ...group, displayOrder: Number(event.target.value) })} />
              </Field>
            </div>
            <label className="toggle-field">
              <input checked={group.isRequired} type="checkbox" onChange={(event) => updateGroup(groupIndex, { ...group, isRequired: event.target.checked })} />
              اختيار هذه المجموعة إجباري
            </label>
            {group.values.map((value, valueIndex) => (
              <div className="option-row" key={value.id}>
                <input value={value.label} placeholder="القيمة" onChange={(event) => updateGroup(groupIndex, { ...group, values: group.values.map((item, index) => (index === valueIndex ? { ...item, label: event.target.value } : item)) })} />
                <input min="0" type="number" value={value.extraPrice} onChange={(event) => updateGroup(groupIndex, { ...group, values: group.values.map((item, index) => (index === valueIndex ? { ...item, extraPrice: Number(event.target.value) } : item)) })} />
                <button className="text-button" type="button" onClick={() => updateGroup(groupIndex, { ...group, values: group.values.filter((item) => item.id !== value.id) })}>
                  حذف
                </button>
              </div>
            ))}
            <button className="text-button" type="button" onClick={() => updateGroup(groupIndex, { ...group, values: [...group.values, createValue(group)] })}>
              إضافة قيمة
            </button>
          </article>
        ))}
        <button className="button button-secondary" type="button" onClick={() => onChange({ ...draft, hasVariants: true, optionGroups: [...draft.optionGroups, createGroup()] })}>
          إضافة مجموعة خيارات
        </button>
      </div>
    </section>
  );
}

function CustomizationSection({ draft, onChange }: SectionProps & { onChange: (draft: ProductDraft) => void }) {
  function createField(): ProductCustomizationFieldDraft {
    return {
      id: createId('field'),
      label: '',
      type: 'shortText',
      description: '',
      placeholder: '',
      isRequired: false,
      displayOrder: draft.customizationFields.length + 1,
      additionalPrice: 0,
      minLength: null,
      maxLength: null,
      minValue: null,
      maxValue: null,
      allowedFiles: [],
      choiceLabels: [],
      isActive: true,
    };
  }

  function updateField(index: number, field: ProductCustomizationFieldDraft) {
    onChange({ ...draft, customizationFields: draft.customizationFields.map((item, itemIndex) => (itemIndex === index ? field : item)) });
  }

  return (
    <section className="form-section">
      <div className="section-kicker">05</div>
      <div>
        <h2>خيارات التخصيص</h2>
        {draft.customizationFields.map((field, index) => (
          <article className="nested-editor" key={field.id}>
            <div className="form-grid">
              <Field label="اسم الحقل">
                <input value={field.label} placeholder="مثال: الاسم المطلوب" onChange={(event) => updateField(index, { ...field, label: event.target.value })} />
              </Field>
              <Field label="نوع الحقل">
                <select value={field.type} onChange={(event) => updateField(index, { ...field, type: event.target.value as ProductCustomizationFieldDraft['type'] })}>
                  <option value="shortText">نص قصير</option>
                  <option value="longText">نص طويل</option>
                  <option value="imageUpload">رفع صورة</option>
                  <option value="singleSelect">قائمة اختيار</option>
                  <option value="multiSelect">اختيار متعدد</option>
                  <option value="checkbox">مربع اختيار</option>
                  <option value="date">تاريخ</option>
                  <option value="number">رقم</option>
                </select>
              </Field>
              <Field label="تكلفة إضافية">
                <input min="0" type="number" value={field.additionalPrice} onChange={(event) => updateField(index, { ...field, additionalPrice: Number(event.target.value) })} />
              </Field>
              <Field label="خيارات القائمة">
                <input value={field.choiceLabels.join(', ')} placeholder="اكتبي الخيارات مفصولة بفواصل" onChange={(event) => updateField(index, { ...field, choiceLabels: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} />
              </Field>
            </div>
            <Field label="تعليمات للعميل">
              <input value={field.description} onChange={(event) => updateField(index, { ...field, description: event.target.value })} />
            </Field>
            <label className="toggle-field">
              <input checked={field.isRequired} type="checkbox" onChange={(event) => updateField(index, { ...field, isRequired: event.target.checked })} />
              هذا الحقل إجباري
            </label>
          </article>
        ))}
        <button className="button button-secondary" type="button" onClick={() => onChange({ ...draft, customizationFields: [...draft.customizationFields, createField()] })}>
          إضافة حقل تخصيص
        </button>
      </div>
    </section>
  );
}

function InventorySection({ draft, update }: SectionProps & { update: <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => void }) {
  return (
    <section className="form-section">
      <div className="section-kicker">06</div>
      <div>
        <h2>المخزون ومدة التجهيز</h2>
        <div className="form-grid">
          <label className="toggle-field">
            <input checked={draft.madeToOrder} type="checkbox" onChange={(event) => update('madeToOrder', event.target.checked)} />
            مصنوع حسب الطلب
          </label>
          <label className="toggle-field">
            <input checked={draft.inventoryTrackingEnabled} type="checkbox" onChange={(event) => update('inventoryTrackingEnabled', event.target.checked)} />
            تتبع المخزون
          </label>
          <Field label="الكمية">
            <input min="0" type="number" value={draft.quantity ?? ''} disabled={draft.madeToOrder} onChange={(event) => update('quantity', event.target.value === '' ? null : Number(event.target.value))} />
          </Field>
          <Field label="تنبيه انخفاض المخزون">
            <input min="0" type="number" value={draft.lowStockThreshold} onChange={(event) => update('lowStockThreshold', Number(event.target.value))} />
          </Field>
          <Field label="أقل كمية للطلب">
            <input min="1" type="number" value={draft.minOrderQuantity} onChange={(event) => update('minOrderQuantity', Number(event.target.value))} />
          </Field>
          <Field label="أعلى كمية للطلب">
            <input min="1" type="number" value={draft.maxOrderQuantity ?? ''} onChange={(event) => update('maxOrderQuantity', event.target.value === '' ? null : Number(event.target.value))} />
          </Field>
          <Field label="أقل مدة تجهيز">
            <input min="0" type="number" value={draft.minPreparationDays ?? ''} onChange={(event) => update('minPreparationDays', event.target.value === '' ? null : Number(event.target.value))} />
          </Field>
          <Field label="أعلى مدة تجهيز">
            <input min="0" type="number" value={draft.maxPreparationDays ?? ''} onChange={(event) => update('maxPreparationDays', event.target.value === '' ? null : Number(event.target.value))} />
          </Field>
        </div>
        <Field label="ملاحظة التجهيز">
          <input value={draft.preparationNote} placeholder="مثال: يحتاج من 3 إلى 5 أيام عمل" onChange={(event) => update('preparationNote', event.target.value)} />
        </Field>
      </div>
    </section>
  );
}

function VisibilitySection({ draft, update }: SectionProps & { update: <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => void }) {
  return (
    <section className="form-section">
      <div className="section-kicker">07</div>
      <div>
        <h2>إعدادات الظهور</h2>
        <div className="toggle-grid">
          <label className="toggle-field"><input checked={draft.showOnHomepage} type="checkbox" onChange={(event) => update('showOnHomepage', event.target.checked)} /> يظهر في الصفحة الرئيسية</label>
          <label className="toggle-field"><input checked={draft.isFeatured} type="checkbox" onChange={(event) => update('isFeatured', event.target.checked)} /> منتج مميز</label>
          <label className="toggle-field"><input checked={draft.isNew} type="checkbox" onChange={(event) => update('isNew', event.target.checked)} /> منتج جديد</label>
          <label className="toggle-field"><input checked={draft.showInSuggestions} type="checkbox" onChange={(event) => update('showInSuggestions', event.target.checked)} /> ضمن المقترحات</label>
          <label className="toggle-field"><input checked={draft.directAccessOnly} type="checkbox" onChange={(event) => update('directAccessOnly', event.target.checked)} /> رابط مباشر فقط</label>
          <label className="toggle-field"><input checked={draft.allowOrdering} type="checkbox" onChange={(event) => update('allowOrdering', event.target.checked)} /> يسمح بالطلب</label>
        </div>
      </div>
    </section>
  );
}

function PreviewSection({ draft, pricingLabel }: { draft: ProductDraft; pricingLabel: string }) {
  const primary = draft.images.find((image) => image.isPrimary) ?? draft.images[0];

  return (
    <section className="form-section product-preview-section">
      <div className="section-kicker">08</div>
      <div>
        <h2>معاينة المنتج</h2>
        <article className="admin-product-preview">
          <div className="preview-media">{primary?.imageUrl ? <img src={resolveMediaUrl(primary.imageUrl)} alt={primary.altText || draft.name} /> : <span>صورة المنتج</span>}</div>
          <div>
            <span className="product-tag">{draft.status === 'published' ? 'منشور' : 'مسودة'}</span>
            <h3>{draft.name || 'اسم المنتج'}</h3>
            <p>{draft.shortDescription || 'الوصف المختصر يظهر هنا للعميل.'}</p>
            <strong>{pricingLabel}</strong>
            {draft.optionGroups.length > 0 ? <small>{draft.optionGroups.length} مجموعات خيارات</small> : null}
            {draft.customizationFields.length > 0 ? <small>{draft.customizationFields.length} حقول تخصيص</small> : null}
          </div>
        </article>
      </div>
    </section>
  );
}

function Field({ children, error, label }: { children: ReactNode; error?: string; label: string }) {
  return (
    <label className="field admin-field">
      {label}
      {children}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
