import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OwnerLayout } from '../../../shared/components/layout/OwnerLayout';
import { Pagination, paginateItems } from '../../../shared/components/ui/Pagination';
import { getOwnerOrders, updateOrderStatus } from '../services/orderApi';
import { type Order, type OrderStatus } from '../types/orderTypes';

const statuses: Array<{ value: OrderStatus | ''; label: string }> = [
  { value: '', label: 'كل الحالات' },
  { value: 'pending', label: 'جديد' },
  { value: 'approved', label: 'مقبول' },
  { value: 'received', label: 'تم استلامه' },
  { value: 'preparing', label: 'قيد التجهيز' },
  { value: 'ready', label: 'جاهز' },
  { value: 'shipped', label: 'تم الشحن' },
  { value: 'completed', label: 'مكتمل' },
  { value: 'cancelled', label: 'ملغي' },
  { value: 'rejected', label: 'مرفوض' },
];

const nextStatuses = statuses.filter((status): status is { value: OrderStatus; label: string } => status.value !== '');

export function OwnerOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') ?? '');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    void loadOrders();
  }, [status]);

  useEffect(() => {
    const nextStatus = searchParams.get('status') ?? '';
    setStatus(nextStatus);
  }, [searchParams]);

  async function loadOrders() {
    setIsLoading(true);
    try {
      const response = await getOwnerOrders({ status, search });
      setOrders(response.data ?? []);
      setPage(1);
    } catch {
      setError('تعذر تحميل الطلبات.');
    } finally {
      setIsLoading(false);
    }
  }

  async function changeStatus(order: Order, nextStatus: OrderStatus) {
    setMessage('');
    setError('');
    try {
      await updateOrderStatus(order.id, nextStatus);
      setMessage('تم تحديث حالة الطلب.');
      await loadOrders();
    } catch (caughtError) {
      setError(extractError(caughtError));
    }
  }

  const totals = useMemo(() => ({
    all: orders.length,
    pending: orders.filter((order) => order.status === 'pending').length,
    active: orders.filter((order) => !['completed', 'cancelled', 'rejected'].includes(order.status)).length,
  }), [orders]);
  const visibleOrders = useMemo(() => paginateItems(orders, page, pageSize), [orders, page, pageSize]);

  return (
    <OwnerLayout>
      <section className="owner-page-heading">
        <p className="eyebrow">إدارة الطلبات</p>
        <h2>طلبات الزبائن</h2>
        <p>تابع طلبات الزبائن من لحظة الإرسال حتى التجهيز والتسليم.</p>
      </section>

      <section className="owner-stats">
        <Stat label="كل الطلبات" value={totals.all} />
        <Stat label="طلبات جديدة" value={totals.pending} />
        <Stat label="طلبات نشطة" value={totals.active} />
      </section>

      <section className="product-filters owner-order-filters">
        <input value={search} placeholder="بحث برقم الطلب أو اسم الزبون" onChange={(event) => setSearch(event.target.value)} />
        <select
          value={status}
          onChange={(event) => {
            const nextStatus = event.target.value;
            setStatus(nextStatus);
            setSearchParams(nextStatus ? { status: nextStatus } : {});
          }}
        >
          {statuses.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}
        </select>
        <button className="button button-secondary" type="button" onClick={() => void loadOrders()}>بحث</button>
      </section>

      {message ? <div className="form-success">{message}</div> : null}
      {error ? <div className="form-error">{error}</div> : null}

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل الطلبات...</div>
      ) : orders.length === 0 ? (
        <p className="empty-state">لا توجد طلبات مطابقة.</p>
      ) : (
        <div className="owner-table-wrap">
          <table className="owner-products-table">
            <thead>
              <tr>
                <th>الطلب</th>
                <th>الزبون</th>
                <th>الإجمالي</th>
                <th>الحالة</th>
                <th>المنتجات</th>
                <th>تغيير الحالة</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.orderNumber}</strong>
                    <small className="table-subtext">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</small>
                  </td>
                  <td>
                    {order.customerName}
                    <small className="table-subtext">{order.customerPhoneNumber}</small>
                  </td>
                  <td>{order.total.toLocaleString('ar')} شيكل</td>
                  <td><span className={`status-badge ${order.status}`}>{order.statusLabel}</span></td>
                  <td>
                    <div className="order-items-summary">
                      {order.items.map((item) => (
                        <span key={item.id}>
                          {item.productName} × {item.quantity}
                          {item.customizationSummary ? <small>{item.customizationSummary}</small> : null}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <select value={order.status} onChange={(event) => void changeStatus(order, event.target.value as OrderStatus)}>
                      {nextStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} pageSize={pageSize} totalItems={orders.length} onPageChange={setPage} />
        </div>
      )}
    </OwnerLayout>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function extractError(error: unknown): string {
  if (typeof error === 'object' && error && 'errors' in error && Array.isArray((error as { errors: unknown }).errors)) {
    return ((error as { errors: string[] }).errors).join(' ');
  }

  if (typeof error === 'object' && error && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }

  return 'تعذر تحديث الطلب.';
}
