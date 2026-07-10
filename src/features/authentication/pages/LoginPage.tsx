import { Link } from 'react-router-dom';
import { PublicLayout } from '../../../shared/components/layout/PublicLayout';
import { ROUTES } from '../../../shared/constants/routes';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <PublicLayout
      title="تسجيل الدخول"
      subtitle="ادخل كصاحب محل أو زبون للوصول إلى لوحة التحكم المناسبة لحسابك."
      sideTitle="هدايا ريزن يدوية بتفاصيل ناعمة وتغليف يليق بالمناسبة"
    >
      <LoginForm />
      <p className="auth-switch">
        ليس لديك حساب؟ <Link to={ROUTES.register}>إنشاء حساب زبون جديد</Link>
      </p>
    </PublicLayout>
  );
}
