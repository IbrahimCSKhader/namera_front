import { Link } from 'react-router-dom';
import { PublicLayout } from '../../../shared/components/layout/PublicLayout';
import { ROUTES } from '../../../shared/constants/routes';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return (
    <PublicLayout
      title="إنشاء حساب"
      subtitle="ابدأ رحلتك في عالم الحرف اليدوية الراقية اليوم"
      sideTitle="هدايا يدوية بتفاصيل ناعمة وتغليف يليق بالمناسبة"
    >
      <RegisterForm />
      <p className="auth-switch auth-switch-box">
        لديك حساب بالفعل؟ <Link to={ROUTES.login}>سجل دخولك</Link>
      </p>
    </PublicLayout>
  );
}
