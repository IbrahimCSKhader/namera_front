import { useAuth } from '../../authentication/hooks/useAuth';
import { OwnerLayout } from '../../../shared/components/layout/OwnerLayout';

export function OwnerDashboardPage() {
  const { user } = useAuth();

  return (
    <OwnerLayout>
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">لوحة صاحب المحل</p>
          <h2>أهلًا {user?.firstName}، لوحة الإدارة جاهزة</h2>
          <p>هذه واجهة البداية لإدارة متجر Namira، ويمكن البناء عليها للمنتجات والطلبات لاحقًا.</p>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <span className="dashboard-number">0</span>
          <h3>طلبات اليوم</h3>
          <p>مكان جاهز لعرض طلبات الزبائن فور إضافة نظام الطلبات.</p>
        </article>
        <article className="dashboard-card">
          <span className="dashboard-number">0</span>
          <h3>منتجات منشورة</h3>
          <p>سيتم ربطه بقسم إدارة المنتجات عند تجهيز CRUD المنتجات.</p>
        </article>
        <article className="dashboard-card">
          <span className="dashboard-number">Owner</span>
          <h3>الدور الحالي</h3>
          <p>تم تسجيل الدخول كصاحب محل باستخدام صلاحية الإدارة.</p>
        </article>
      </section>
    </OwnerLayout>
  );
}
