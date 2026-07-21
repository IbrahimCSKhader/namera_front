import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { OwnerLayout } from '../../../shared/components/layout/OwnerLayout';
import { useAuth } from '../../authentication/hooks/useAuth';
import { getOwnerDashboardStats } from '../../orders/services/orderApi';
import { type OwnerDashboardStats } from '../../orders/types/orderTypes';

export function OwnerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<OwnerDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await getOwnerDashboardStats();
        setStats(response.data ?? null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadStats();
  }, []);

  const maxStatusCount = useMemo(
    () => Math.max(1, ...(stats?.ordersByStatus.map((item) => item.count) ?? [1])),
    [stats],
  );
  const maxRevenue = useMemo(
    () => Math.max(1, ...(stats?.revenueByDay.map((item) => item.revenue) ?? [1])),
    [stats],
  );

  return (
    <OwnerLayout>
      <section className="dashboard-hero owner-dashboard-hero">
        <div>
          <p className="eyebrow">لوحة صاحب المتجر</p>
          <h2>أهلا {user?.firstName}، المتجر تحت السيطرة</h2>
          <p>تابع الطلبات، العملاء، المنتجات، والإيراد من شاشة واحدة مرتبطة بالبيانات الفعلية.</p>
        </div>
        <Link className="button button-primary" to={ROUTES.ownerOrders}>
          إدارة الطلبات
        </Link>
      </section>

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل الإحصائيات...</div>
      ) : (
        <>
          <section className="dashboard-grid">
            <Stat label="كل الطلبات" value={stats?.totalOrders ?? 0} />
            <Stat label="طلبات جديدة" value={stats?.pendingOrders ?? 0} />
            <Stat label="قيد الاعتماد" value={stats?.approvedOrders ?? 0} />
            <Stat label="عملاء" value={stats?.customersCount ?? 0} />
            <Stat label="منتجات" value={stats?.productsCount ?? 0} />
            <Stat label="الإيراد" value={`${(stats?.revenue ?? 0).toLocaleString('ar')} شيكل`} />
          </section>

          <section className="dashboard-charts">
            <article className="chart-panel">
              <h3>الطلبات حسب الحالة</h3>
              <div className="bar-chart">
                {(stats?.ordersByStatus ?? []).map((item) => (
                  <div className="bar-row" key={item.status}>
                    <span>{item.label}</span>
                    <div><i style={{ width: `${Math.max(8, (item.count / maxStatusCount) * 100)}%` }} /></div>
                    <strong>{item.count}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="chart-panel">
              <h3>الإيراد اليومي</h3>
              <div className="column-chart">
                {(stats?.revenueByDay ?? []).map((item) => (
                  <div key={item.date}>
                    <span style={{ height: `${Math.max(8, (item.revenue / maxRevenue) * 100)}%` }} />
                    <small>{new Date(item.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}</small>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      )}
    </OwnerLayout>
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
