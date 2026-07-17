import { Link } from 'react-router-dom';
import { useAuth } from '../../authentication/hooks/useAuth';
import { CustomerLayout } from '../../../shared/components/layout/CustomerLayout';
import { BRAND } from '../../../shared/constants/brand';
import { ROUTES } from '../../../shared/constants/routes';

export function CustomerDashboardPage() {
  const { user } = useAuth();

  return (
    <CustomerLayout>
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">لوحة الزبون</p>
          <h2>أهلًا {user?.firstName}، حسابك جاهز</h2>
          <p>من هنا ستتابع الطلبات، العنوان، وتفاصيل حسابك في متجر {BRAND.name}.</p>
        </div>
        <Link className="button button-primary" to={ROUTES.customerProfile}>
          تعديل الملف الشخصي
        </Link>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <span className="dashboard-number">0</span>
          <h3>طلبات حالية</h3>
          <p>سيظهر هنا أي طلب جديد بعد ربط صفحة المنتجات والسلة.</p>
        </article>
        <article className="dashboard-card">
          <span className="dashboard-number">جاهز</span>
          <h3>حالة الحساب</h3>
          <p>تسجيل الدخول يعمل والزبون يفتح لوحة خاصة به حسب الدور.</p>
        </article>
        <article className="dashboard-card">
          <span className="dashboard-number">حساب</span>
          <h3>بيانات التواصل</h3>
          <p>{user?.phoneNumber || 'رقم الهاتف غير متوفر'}</p>
        </article>
      </section>
    </CustomerLayout>
  );
}
