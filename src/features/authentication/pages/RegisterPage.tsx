import { Link } from 'react-router-dom';
import { PublicLayout } from '../../../shared/components/layout/PublicLayout';
import { ROUTES } from '../../../shared/constants/routes';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return (
    <PublicLayout
      title="إنشاء حساب زبون"
      subtitle="أنشئ حسابك لتجربة التسجيل ثم افتح لوحة الزبون مباشرة."
      sideTitle="ابدأ رحلتك في متجر Namira للهدايا اليدوية"
    >
      <RegisterForm />
      <p className="auth-switch auth-switch-box">
        لديك حساب بالفعل؟ <Link to={ROUTES.login}>سجل دخولك</Link>
      </p>
    </PublicLayout>
  );
}
