import { Link } from 'react-router-dom';
import { PublicLayout } from '../../../shared/components/layout/PublicLayout';
import { ROUTES } from '../../../shared/constants/routes';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <PublicLayout
      title={'\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644'}
      subtitle={
        '\u0627\u062f\u062e\u0644 \u0643\u0635\u0627\u062d\u0628 \u0645\u062d\u0644 \u0623\u0648 \u0632\u0628\u0648\u0646 \u0644\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u062d\u0633\u0627\u0628\u0643.'
      }
      sideTitle={
        '\u0647\u062f\u0627\u064a\u0627 \u0631\u064a\u0632\u0646 \u064a\u062f\u0648\u064a\u0629 \u0628\u062a\u0641\u0627\u0635\u064a\u0644 \u0646\u0627\u0639\u0645\u0629 \u0648\u062a\u063a\u0644\u064a\u0641 \u064a\u0644\u064a\u0642 \u0628\u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629'
      }
    >
      <LoginForm />
      <p className="auth-switch">
        {'\u0644\u064a\u0633 \u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f '}
        <Link to={ROUTES.register}>
          {'\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628 \u0632\u0628\u0648\u0646 \u062c\u062f\u064a\u062f'}
        </Link>
      </p>
    </PublicLayout>
  );
}
