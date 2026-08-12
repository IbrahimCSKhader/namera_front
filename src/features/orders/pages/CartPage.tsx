import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentication/hooks/useAuth';
import { createOrder } from '../services/orderApi';
import { clearCart, readCart, updateCartQuantity } from '../utils/cartStorage';
import { ROUTES } from '../../../shared/constants/routes';
import { resolveMediaUrl } from '../../../shared/utils/mediaUrl';
import { type Order } from '../types/orderTypes';
import { getOrderCustomizationImageUrls, getOrderItemCustomizationImageUrls, getOrderItemCustomizationTextLines } from '../utils/orderMedia';

const ownerWhatsAppNumber = '972595769185';

export function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState(() => readCart());
  const [customerName, setCustomerName] = useState('');
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items]);
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setCustomerName((current) => current || `${user.firstName} ${user.lastName}`.trim());
    setCustomerPhoneNumber((current) => current || user.phoneNumber);
    setShippingAddress((current) => current || user.address);
  }, [user]);

  function changeQuantity(cartItemId: string, quantity: number) {
    updateCartQuantity(cartItemId, quantity);
    setItems(readCart());
  }

  async function submitOrder() {
    if (items.length === 0) {
      setError('السلة فارغة.');
      return;
    }

    if (!customerName.trim() || !customerPhoneNumber.trim() || !shippingAddress.trim()) {
      setError('أكمل الاسم ورقم الهاتف وعنوان التوصيل قبل إرسال الطلب.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions.map((option) => ({
            groupId: option.groupId,
            valueId: option.valueId,
          })),
          customFields: item.customFields.map((field) => ({
            fieldId: field.fieldId,
            value: field.value,
            selectedChoiceIds: field.selectedChoiceIds,
          })),
          customRequest: item.customRequest,
          customRequestItems: item.customRequestItems.map((requestItem) => ({
            text: requestItem.text,
            imageUrl: requestItem.imageUrl,
          })),
        })),
        customerName: customerName.trim(),
        customerPhoneNumber: customerPhoneNumber.trim(),
        shippingAddress,
        notes,
      });

      clearCart();
      setItems([]);
      setMessage(`تم إرسال الطلب ${response.data?.orderNumber ?? ''} بنجاح.`);
      if (response.data) {
        await openOrderInWhatsApp(response.data);
      }
      if (isAuthenticated) {
        navigate(ROUTES.customerOrders);
      }
    } catch (caughtError) {
      setError(extractError(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-page">
      <div className="app-content">
        <section className="owner-page-heading split-heading">
          <div>
            <p className="eyebrow">السلة</p>
            <h2>مراجعة الطلب</h2>
            <p>راجعي المنتجات، اكتبي بيانات التواصل، وبعدها أرسلي الطلب مباشرة.</p>
          </div>
          <Link className="button button-secondary" to={ROUTES.products}>متابعة التسوق</Link>
        </section>

        {message ? <div className="form-success cart-page-message">{message}</div> : null}
        {error && items.length === 0 ? <div className="form-error cart-page-message">{error}</div> : null}

        {items.length === 0 ? (
          <p className="empty-state">السلة فارغة حاليا.</p>
        ) : (
          <>
            <div className="checkout-steps" aria-label="خطوات إتمام الطلب">
              <span className="active"><b>1</b> مراجعة المنتجات</span>
              <span><b>2</b> بيانات التواصل</span>
              <span><b>3</b> تأكيد الإرسال</span>
            </div>

            <section className="cart-layout">
              <div className="cart-items">
                <div className="cart-section-heading">
                  <div>
                    <span>منتجات الطلب</span>
                    <small>{itemCount.toLocaleString('ar')} قطعة داخل السلة</small>
                  </div>
                  <strong>{total.toLocaleString('ar')} شيكل</strong>
                </div>
                {items.map((item) => (
                  <article className="cart-item" key={item.cartItemId}>
                    {item.imageUrl ? <img src={resolveMediaUrl(item.imageUrl)} alt={item.name} loading="lazy" decoding="async" /> : <span className="table-thumb empty" />}
                    <div className="cart-item-body">
                      <h3>{item.name}</h3>
                      <p>{item.priceLabel || `${item.unitPrice.toLocaleString('ar')} شيكل`}</p>
                      {item.customizationSummary ? <small className="cart-customization-summary">{item.customizationSummary}</small> : null}
                      <CartCustomizationImages imageUrls={collectCartCustomizationImageUrls(item)} productName={item.name} />
                    </div>
                    <div className="cart-quantity-control" aria-label={`كمية ${item.name}`}>
                      <button type="button" onClick={() => changeQuantity(item.cartItemId, item.quantity - 1)} aria-label="تقليل الكمية">-</button>
                      <input min="0" type="number" value={item.quantity} onChange={(event) => changeQuantity(item.cartItemId, Number(event.target.value))} />
                      <button type="button" onClick={() => changeQuantity(item.cartItemId, item.quantity + 1)} aria-label="زيادة الكمية">+</button>
                      <small>{(item.unitPrice * item.quantity).toLocaleString('ar')} شيكل</small>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="cart-summary">
              <div className="cart-summary-total">
                <span>الإجمالي</span>
                <strong>{total.toLocaleString('ar')} شيكل</strong>
              </div>
              <div className="cart-contact-box">
                <span>{isAuthenticated ? 'معلومات الحساب' : 'طلب بدون حساب'}</span>
                <p>{isAuthenticated ? 'يمكن تعديل المعلومات لهذا الطلب فقط.' : 'لا يحتاج الطلب إلى تسجيل دخول، فقط اترك معلومات التواصل.'}</p>
              </div>
              <div className="cart-form-heading">
                <span>بيانات التواصل والتوصيل</span>
                <small>هذه المعلومات تستخدم لإرسال الطلب وتأكيد التفاصيل.</small>
              </div>
              <label className="field admin-field">
                اسم الزبون
                <input value={customerName} placeholder="مثال: ميار أحمد" onChange={(event) => setCustomerName(event.target.value)} />
              </label>
              <label className="field admin-field">
                رقم الهاتف
                <input dir="ltr" value={customerPhoneNumber} placeholder="0590000000" onChange={(event) => setCustomerPhoneNumber(event.target.value)} />
              </label>
              <label className="field admin-field">
                عنوان التوصيل
                <textarea rows={3} value={shippingAddress} placeholder="المدينة، الشارع، وأي تفاصيل مهمة للتوصيل" onChange={(event) => setShippingAddress(event.target.value)} />
              </label>
              <label className="field admin-field">
                ملاحظات
                <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} />
              </label>
              {error ? <div className="form-error">{error}</div> : null}
              {message ? <div className="form-success">{message}</div> : null}
              <button className="button button-primary" type="button" disabled={isSubmitting} onClick={() => void submitOrder()}>
                {isSubmitting ? 'جار إرسال الطلب...' : 'تأكيد وإرسال الطلب'}
              </button>
              </aside>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function CartCustomizationImages({ imageUrls, productName }: { imageUrls: string[]; productName: string }) {
  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <div className="order-media-grid cart-customization-images">
      {imageUrls.map((imageUrl, index) => {
        const resolvedImageUrl = resolveMediaUrl(imageUrl);

        return (
          <a href={resolvedImageUrl} key={resolvedImageUrl} target="_blank" rel="noreferrer" aria-label={`فتح صورة تخصيص ${productName}`}>
            <img src={resolvedImageUrl} alt={`${productName} تخصيص ${index + 1}`} loading="lazy" decoding="async" />
          </a>
        );
      })}
    </div>
  );
}

function collectCartCustomizationImageUrls(item: ReturnType<typeof readCart>[number]) {
  return [
    ...item.customFields
      .filter((field) => field.fieldType === 'imageUpload' && field.value)
      .map((field) => field.value),
    ...item.customRequestItems
      .map((requestItem) => requestItem.imageUrl ?? '')
      .filter(Boolean),
  ];
}

function extractError(error: unknown): string {
  if (typeof error === 'object' && error && 'errors' in error && Array.isArray((error as { errors: unknown }).errors)) {
    return ((error as { errors: string[] }).errors).join(' ');
  }

  if (typeof error === 'object' && error && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }

  return 'تعذر إرسال الطلب. حاول مرة أخرى.';
}

async function openOrderInWhatsApp(order: Order) {
  const shareMessage = buildWhatsAppOrderMessage(order, 'attached');

  if (await shareOrderImages(order, shareMessage)) {
    return;
  }

  const fallbackMessage = buildWhatsAppOrderMessage(order, 'dashboard');
  const whatsappUrl = `https://wa.me/${ownerWhatsAppNumber}?text=${encodeURIComponent(fallbackMessage)}`;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

function buildWhatsAppOrderMessage(order: Order, imageDelivery: 'attached' | 'dashboard') {
  const itemsText = order.items
    .map((item, index) => buildWhatsAppOrderItemText(item, index, imageDelivery))
    .join('\n');

  return [
    'طلب جديد من متجر Namira',
    `رقم الطلب: ${order.orderNumber}`,
    `الزبون: ${order.customerName || 'غير محدد'}`,
    `الهاتف: ${order.customerPhoneNumber || 'غير محدد'}`,
    `العنوان: ${order.shippingAddress || 'غير محدد'}`,
    '',
    'المنتجات:',
    itemsText,
    '',
    `الإجمالي: ${order.total.toLocaleString('ar')} شيكل`,
    order.notes ? `ملاحظات: ${order.notes}` : '',
  ].filter(Boolean).join('\n');
}

function buildWhatsAppOrderItemText(item: Order['items'][number], index: number, imageDelivery: 'attached' | 'dashboard') {
  const textLines = getOrderItemCustomizationTextLines(item);
  const customization = textLines.length > 0
    ? `\n   التخصيص: ${textLines.join(' | ')}`
    : '';
  const imageCount = getOrderItemCustomizationImageUrls(item).length;
  const images = imageCount > 0
    ? imageDelivery === 'attached'
      ? `\n   صور التخصيص: ${imageCount} مرفقة كصور`
      : `\n   صور التخصيص: ${imageCount} ظاهرة داخل الطلب في لوحة الإدارة`
    : '';

  return `${index + 1}. ${item.productName} × ${item.quantity} - ${item.lineTotal.toLocaleString('ar')} شيكل${customization}${images}`;
}

async function shareOrderImages(order: Order, message: string): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  const imageUrls = getOrderCustomizationImageUrls(order);
  if (imageUrls.length === 0) {
    return false;
  }

  try {
    const files = (await Promise.all(imageUrls.map(fetchImageAsFile))).filter((file): file is File => Boolean(file));

    if (files.length === 0) {
      return false;
    }

    const shareData: ShareData = {
      title: `Namira ${order.orderNumber}`,
      text: message,
      files,
    };

    if (navigator.canShare && !navigator.canShare(shareData)) {
      return false;
    }

    await navigator.share(shareData);
    return true;
  } catch (error) {
    return typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError';
  }
}

async function fetchImageAsFile(imageUrl: string, index: number): Promise<File | null> {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    return null;
  }

  const blob = await response.blob();
  if (!blob.type.startsWith('image/')) {
    return null;
  }

  return new File([blob], `namira-order-${index + 1}.${getImageExtension(imageUrl, blob.type)}`, { type: blob.type });
}

function getImageExtension(imageUrl: string, contentType: string): string {
  const pathExtension = new URL(imageUrl, window.location.origin).pathname.split('.').pop();

  if (pathExtension && /^[a-z0-9]{2,5}$/i.test(pathExtension)) {
    return pathExtension;
  }

  return contentType.split('/')[1] || 'jpg';
}
