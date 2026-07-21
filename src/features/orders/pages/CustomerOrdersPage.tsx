import { useEffect, useState } from 'react';
import { CustomerLayout } from '../../../shared/components/layout/CustomerLayout';
import { Pagination, paginateItems } from '../../../shared/components/ui/Pagination';
import { resolveMediaUrl } from '../../../shared/utils/mediaUrl';
import { getMyOrders } from '../services/orderApi';
import { type Order } from '../types/orderTypes';

export function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const visibleOrders = paginateItems(orders, page, pageSize);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await getMyOrders();
        setOrders(response.data ?? []);
      } catch {
        setError('تعذر تحميل الطلبات.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrders();
  }, []);

  return (
    <CustomerLayout>
      <section className="owner-page-heading">
        <p className="eyebrow">طلباتي</p>
        <h2>متابعة الطلبات</h2>
        <p>يمكنك متابعة حالة كل طلب من الإرسال حتى التجهيز أو التسليم.</p>
      </section>

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل الطلبات...</div>
      ) : error ? (
        <p className="empty-state">{error}</p>
      ) : orders.length === 0 ? (
        <p className="empty-state">لا توجد طلبات حتى الآن.</p>
      ) : (
        <div className="orders-list">
          {visibleOrders.map((order) => (
            <article className="order-card" key={order.id}>
              <header>
                <div>
                  <span className={`status-badge ${order.status}`}>{order.statusLabel}</span>
                  <h3>{order.orderNumber}</h3>
                </div>
                <strong>{order.total.toLocaleString('ar')} شيكل</strong>
              </header>
              <div className="order-items-strip">
                {order.items.map((item) => (
                  <div key={item.id}>
                    {item.imageUrl ? <img src={resolveMediaUrl(item.imageUrl)} alt={item.productName} loading="lazy" decoding="async" /> : null}
                    <span>
                      {item.productName} × {item.quantity}
                      {item.customizationSummary ? <small>{item.customizationSummary}</small> : null}
                    </span>
                  </div>
                ))}
              </div>
              {order.ownerNote ? <p className="order-note">{order.ownerNote}</p> : null}
            </article>
          ))}
          <Pagination page={page} pageSize={pageSize} totalItems={orders.length} onPageChange={setPage} />
        </div>
      )}
    </CustomerLayout>
  );
}
