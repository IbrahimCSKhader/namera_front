import { CustomerLayout } from '../../../shared/components/layout/CustomerLayout';
import { CustomerProfileForm } from '../components/CustomerProfileForm';

export function CustomerProfilePage() {
  return (
    <CustomerLayout>
      <section className="page-heading">
        <p className="eyebrow">حسابي</p>
        <h1>الملف الشخصي</h1>
        <p>حدّث بياناتك الأساسية المستخدمة في الطلبات والتواصل.</p>
      </section>
      <CustomerProfileForm />
    </CustomerLayout>
  );
}
