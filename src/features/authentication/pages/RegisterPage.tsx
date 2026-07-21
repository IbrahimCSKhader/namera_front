import { Link } from 'react-router-dom';
import { PublicLayout } from '../../../shared/components/layout/PublicLayout';
import { BRAND } from '../../../shared/constants/brand';
import { ROUTES } from '../../../shared/constants/routes';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return (
    <PublicLayout
      title="إنشاء حساب زبون"
      subtitle="أنشئ حسابك ثم فعّل بريدك الإلكتروني قبل تسجيل الدخول."
      sideTitle={`ابدأ رحلتك في متجر ${BRAND.name} للهدايا اليدوية`}
    >
      <RegisterForm />
      <p className="auth-switch auth-switch-box">
        لديك حساب بالفعل؟ <Link to={ROUTES.login}>سجل دخولك</Link>
      </p>
    </PublicLayout>
  );
}
