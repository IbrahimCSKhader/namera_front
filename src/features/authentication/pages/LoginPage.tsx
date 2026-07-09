import { Link } from 'react-router-dom';
import { PublicLayout } from '../../../shared/components/layout/PublicLayout';
import { ROUTES } from '../../../shared/constants/routes';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <PublicLayout
      title="مرحباً بك مجدداً"
      subtitle="سجل دخولك لمتابعة طلباتك وتفاصيل حسابك"
      sideTitle="قطع فنية تحكي قصتك بتفاصيل دافئة"
    >
      <LoginForm />
      <p className="auth-switch">
        ليس لديك حساب؟ <Link to={ROUTES.register}>إنشاء حساب جديد</Link>
      </p>
    </PublicLayout>
  );
}
