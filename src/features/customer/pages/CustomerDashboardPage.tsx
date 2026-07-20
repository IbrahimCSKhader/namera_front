import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../authentication/hooks/useAuth';
import { CustomerLayout } from '../../../shared/components/layout/CustomerLayout';
import { BRAND } from '../../../shared/constants/brand';
import { ROUTES } from '../../../shared/constants/routes';
import { getDashboard } from '../services/customerApi';
import { type CustomerDashboard } from '../types/customerTypes';

export function CustomerDashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<CustomerDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getDashboard();
        setDashboard(response.data ?? null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  return (
    <CustomerLayout>
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">لوحة الزبون</p>
          <h2>أهلا {user?.firstName}، حسابك جاهز</h2>
          <p>من هنا تتابع طلباتك، عناوين التوصيل، تقييماتك، وتفاصيل حسابك في متجر {BRAND.name}.</p>
        </div>
        <Link className="button button-primary" to={ROUTES.products}>
          تسوق الآن
        </Link>
      </section>

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل بيانات الحساب...</div>
      ) : (
        <>
          <section className="dashboard-grid">
            <Stat label="كل الطلبات" value={dashboard?.totalOrders ?? 0} />
            <Stat label="طلبات نشطة" value={dashboard?.activeOrders ?? 0} />
            <Stat label="طلبات مكتملة" value={dashboard?.completedOrders ?? 0} />
            <Stat label="عناوين محفوظة" value={dashboard?.addressesCount ?? 0} />
            <Stat label="تقييماتي" value={dashboard?.reviewsCount ?? 0} />
            <Stat label="إجمالي الشراء" value={`${(dashboard?.totalSpent ?? 0).toLocaleString('ar')} شيكل`} />
          </section>

          <section className="customer-quick-actions">
            <Link to={ROUTES.customerOrders}>متابعة الطلبات</Link>
            <Link to={ROUTES.customerAddresses}>إدارة العناوين</Link>
            <Link to={ROUTES.customerReviews}>تقييم المنتجات</Link>
            <Link to={ROUTES.customerProfile}>تعديل الملف الشخصي</Link>
          </section>

          {dashboard?.lastOrderNumber ? (
            <section className="customer-panel last-order-panel">
              <h3>آخر طلب</h3>
              <p>{dashboard.lastOrderNumber}</p>
              <span className={`status-badge ${dashboard.lastOrderStatus ?? ''}`}>{dashboard.lastOrderStatusLabel}</span>
            </section>
          ) : null}
        </>
      )}
    </CustomerLayout>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="dashboard-card">
      <span className="dashboard-number">{value}</span>
      <h3>{label}</h3>
    </article>
  );
}
