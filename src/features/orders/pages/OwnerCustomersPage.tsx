import { useEffect, useMemo, useState } from 'react';
import { OwnerLayout } from '../../../shared/components/layout/OwnerLayout';
import { getOwnerCustomers } from '../services/orderApi';
import { type OwnerCustomer } from '../types/orderTypes';

export function OwnerCustomersPage() {
  const [customers, setCustomers] = useState<OwnerCustomer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await getOwnerCustomers();
        setCustomers(response.data ?? []);
      } catch {
        setError('تعذر تحميل العملاء.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return customers;
    }

    return customers.filter((customer) =>
      [customer.fullName, customer.phoneNumber, customer.email, customer.userName].some((value) => value.toLowerCase().includes(query)),
    );
  }, [customers, search]);

  const totals = useMemo(() => ({
    all: customers.length,
    active: customers.filter((customer) => customer.isActive).length,
    orders: customers.reduce((total, customer) => total + customer.ordersCount, 0),
  }), [customers]);

  return (
    <OwnerLayout>
      <section className="owner-page-heading">
        <p className="eyebrow">إدارة العملاء</p>
        <h2>عملاء المتجر</h2>
        <p>قائمة العملاء المسجلين مع عدد الطلبات وإجمالي المشتريات.</p>
      </section>

      <section className="owner-stats">
        <Stat label="كل العملاء" value={totals.all} />
        <Stat label="عملاء فعالون" value={totals.active} />
        <Stat label="إجمالي الطلبات" value={totals.orders} />
      </section>

      <section className="product-filters owner-customer-filters">
        <input value={search} placeholder="بحث باسم العميل أو الهاتف" onChange={(event) => setSearch(event.target.value)} />
      </section>

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل العملاء...</div>
      ) : error ? (
        <p className="empty-state">{error}</p>
      ) : filteredCustomers.length === 0 ? (
        <p className="empty-state">لا يوجد عملاء مطابقون.</p>
      ) : (
        <div className="owner-table-wrap">
          <table className="owner-products-table">
            <thead>
              <tr>
                <th>العميل</th>
                <th>الهاتف</th>
                <th>البريد</th>
                <th>العنوان</th>
                <th>الطلبات</th>
                <th>إجمالي الشراء</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <strong>{customer.fullName}</strong>
                    <small className="table-subtext">{customer.userName}</small>
                  </td>
                  <td>{customer.phoneNumber}</td>
                  <td>{customer.email}</td>
                  <td>{customer.address}</td>
                  <td>{customer.ordersCount}</td>
                  <td>{customer.totalSpent.toLocaleString('ar')} شيكل</td>
                  <td><span className={customer.isActive ? 'status-badge published' : 'status-badge hidden'}>{customer.isActive ? 'فعال' : 'معطل'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
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
