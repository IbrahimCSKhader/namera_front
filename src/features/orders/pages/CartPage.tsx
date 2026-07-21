import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentication/hooks/useAuth';
import { createOrder } from '../services/orderApi';
import { clearCart, readCart, updateCartQuantity } from '../utils/cartStorage';
import { ROUTES } from '../../../shared/constants/routes';
import { resolveMediaUrl } from '../../../shared/utils/mediaUrl';
import { type Order } from '../types/orderTypes';

const ownerWhatsAppNumber = '972595769185';

export function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(() => readCart());
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items]);

  function changeQuantity(cartItemId: string, quantity: number) {
    updateCartQuantity(cartItemId, quantity);
    setItems(readCart());
  }

  async function submitOrder() {
    if (!isAuthenticated) {
      navigate(ROUTES.login);
      return;
    }

    if (items.length === 0) {
      setError('السلة فارغة.');
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
        })),
        shippingAddress,
        notes,
      });

      clearCart();
      setItems([]);
      setMessage(`تم إرسال الطلب ${response.data?.orderNumber ?? ''} بنجاح.`);
      if (response.data) {
        openOrderInWhatsApp(response.data);
      }
      navigate(ROUTES.customerOrders);
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
            <p>راجعي المنتجات والتخصيصات قبل إرسال الطلب لصاحب المتجر.</p>
          </div>
          <Link className="button button-secondary" to={ROUTES.products}>متابعة التسوق</Link>
        </section>

        {items.length === 0 ? (
          <p className="empty-state">السلة فارغة حاليا.</p>
        ) : (
          <section className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.cartItemId}>
                  {item.imageUrl ? <img src={resolveMediaUrl(item.imageUrl)} alt={item.name} /> : <span className="table-thumb empty" />}
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.priceLabel || `${item.unitPrice.toLocaleString('ar')} شيكل`}</p>
                    {item.customizationSummary ? <small className="cart-customization-summary">{item.customizationSummary}</small> : null}
                  </div>
                  <input min="0" type="number" value={item.quantity} onChange={(event) => changeQuantity(item.cartItemId, Number(event.target.value))} />
                </article>
              ))}
            </div>

            <aside className="cart-summary">
              <h3>ملخص الطلب</h3>
              <strong>{total.toLocaleString('ar')} شيكل</strong>
              <label className="field admin-field">
                عنوان التوصيل
                <textarea rows={3} value={shippingAddress} placeholder="اتركه فارغا لاستخدام عنوان الحساب" onChange={(event) => setShippingAddress(event.target.value)} />
              </label>
              <label className="field admin-field">
                ملاحظات
                <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} />
              </label>
              {error ? <div className="form-error">{error}</div> : null}
              {message ? <div className="form-success">{message}</div> : null}
              <button className="button button-primary" type="button" disabled={isSubmitting} onClick={() => void submitOrder()}>
                {isSubmitting ? 'جار إرسال الطلب...' : 'إرسال الطلب'}
              </button>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
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

function openOrderInWhatsApp(order: Order) {
  const itemsText = order.items
    .map((item, index) => {
      const customization = item.customizationSummary ? `\n   التخصيص: ${item.customizationSummary}` : '';
      return `${index + 1}. ${item.productName} × ${item.quantity} - ${item.lineTotal.toLocaleString('ar')} شيكل${customization}`;
    })
    .join('\n');
  const message = [
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
  const whatsappUrl = `https://wa.me/${ownerWhatsAppNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}
