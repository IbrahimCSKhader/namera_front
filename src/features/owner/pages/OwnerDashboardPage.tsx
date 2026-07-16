import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { OwnerLayout } from '../../../shared/components/layout/OwnerLayout';
import { useAuth } from '../../authentication/hooks/useAuth';

export function OwnerDashboardPage() {
  const { user } = useAuth();

  return (
    <OwnerLayout>
      <section className="dashboard-hero owner-dashboard-hero">
        <div>
          <p className="eyebrow">لوحة صاحبة المتجر</p>
          <h2>أهلًا {user?.firstName}، إدارة المنتجات جاهزة</h2>
          <p>
            يمكنك الآن إنشاء منتجات يدوية مرنة بصور متعددة، طرق تسعير مختلفة، خيارات، تخصيصات، ومخزون من لوحة واحدة.
          </p>
        </div>
        <Link className="button button-primary" to={ROUTES.ownerAddProduct}>
          إضافة منتج
        </Link>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <span className="dashboard-number">01</span>
          <h3>إضافة منتج جديد</h3>
          <p>نموذج مقسّم لأقسام واضحة بدل إدخال كل الحقول في صفحة عشوائية.</p>
        </article>
        <article className="dashboard-card">
          <span className="dashboard-number">02</span>
          <h3>عرض المنتجات</h3>
          <p>جدول إدارة يدعم البحث، التصفية، النشر، الإخفاء، والأرشفة.</p>
        </article>
        <article className="dashboard-card">
          <span className="dashboard-number">03</span>
          <h3>منتجات ديناميكية</h3>
          <p>الخيارات والتخصيصات محفوظة كبيانات، وليست حقولًا ثابتة داخل الكود.</p>
        </article>
      </section>
    </OwnerLayout>
  );
}
