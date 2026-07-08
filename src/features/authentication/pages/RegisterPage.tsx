import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { PublicLayout } from '../../../shared/components/layout/PublicLayout';
import { ROUTES } from '../../../shared/constants/routes';

export function RegisterPage() {
  return (
    <PublicLayout
      title="إنشاء حساب"
      subtitle="مرحباً بك في نميرة. ابدأ رحلتك معنا اليوم."
      sideTitle="هدايا يدوية بتفاصيل ناعمة"
    >
      <RegisterForm />
      <p className="auth-switch auth-switch-box">
        لديك حساب بالفعل؟ <Link to={ROUTES.login}>سجل دخولك</Link>
      </p>
    </PublicLayout>
  );
}
