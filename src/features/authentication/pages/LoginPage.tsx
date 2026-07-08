import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { PublicLayout } from '../../../shared/components/layout/PublicLayout';
import { ROUTES } from '../../../shared/constants/routes';

export function LoginPage() {
  return (
    <PublicLayout
      title="أهلاً بك مجدداً"
      subtitle="يرجى إدخال بياناتك للوصول إلى حسابك"
      sideTitle="قطع فنية تحكي قصتك"
    >
      <LoginForm />
      <p className="auth-switch">
        ليس لديك حساب؟ <Link to={ROUTES.register}>إنشاء حساب جديد</Link>
      </p>
    </PublicLayout>
  );
}
