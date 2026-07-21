import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button';
import { FormError } from '../../../shared/components/ui/FormError';
import { Input } from '../../../shared/components/ui/Input';
import { ROUTES } from '../../../shared/constants/routes';
import { type ApiResponse } from '../../../shared/types/apiResponse';
import { useAuth } from '../hooks/useAuth';
import { resendEmailConfirmation } from '../services/authApi';

export type LoginFormState = {
  identifier: string;
  password: string;
};

export const loginMessages = {
  identifierRequired:
    '\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641 \u0623\u0648 \u0627\u0644\u0628\u0631\u064a\u062f \u0623\u0648 \u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645 \u0645\u0637\u0644\u0648\u0628',
  passwordRequired: '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0645\u0637\u0644\u0648\u0628\u0629',
  fallback:
    '\u062a\u0639\u0630\u0631 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644. \u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0648\u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.',
};

const labels = {
  demoAccounts: '\u062d\u0633\u0627\u0628\u0627\u062a \u062a\u062c\u0631\u064a\u0628\u064a\u0629',
  ownerLogin: '\u062f\u062e\u0648\u0644 \u0635\u0627\u062d\u0628 \u0627\u0644\u0645\u062d\u0644',
  ownerDescription:
    '\u064a\u0641\u062a\u062d \u0644\u0648\u062d\u0629 \u0625\u062f\u0627\u0631\u0629 \u0635\u0627\u062d\u0628 \u0627\u0644\u0645\u062d\u0644',
  customerLogin: '\u062f\u062e\u0648\u0644 \u0632\u0628\u0648\u0646 \u062a\u062c\u0631\u064a\u0628\u064a',
  customerDescription:
    '\u064a\u0641\u062a\u062d \u0644\u0648\u062d\u0629 \u0627\u0644\u0632\u0628\u0648\u0646',
  identifier:
    '\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641 \u0623\u0648 \u0627\u0644\u0628\u0631\u064a\u062f \u0623\u0648 \u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645',
  password: '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631',
  submit: '\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644',
};

const initialFormState: LoginFormState = {
  identifier: '',
  password: '',
};

const demoAccounts = [
  {
    label: labels.ownerLogin,
    identifier: 'namer',
    password: 'namera12345',
    description: labels.ownerDescription,
  },
  {
    label: labels.customerLogin,
    identifier: 'customer_demo',
    password: 'Customer12345',
    description: labels.customerDescription,
  },
];

export function LoginForm() {
  const [formState, setFormState] = useState<LoginFormState>(initialFormState);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [resendMessage, setResendMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateLoginForm(formState);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const user = await login({
        identifier: formState.identifier.trim(),
        password: formState.password,
      });
      navigate(user.role === 'Owner' ? ROUTES.ownerDashboard : ROUTES.customerDashboard, { replace: true });
    } catch (error) {
      setErrors(resolveErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendConfirmation() {
    if (!confirmationEmail.trim()) {
      setErrors(['اكتب البريد الإلكتروني لإعادة إرسال رابط التفعيل']);
      return;
    }

    setIsResending(true);
    setErrors([]);
    setResendMessage('');

    try {
      const response = await resendEmailConfirmation({ email: confirmationEmail.trim() });
      setResendMessage(response.message || 'تم إرسال رابط التفعيل مرة أخرى.');
    } catch (error) {
      setErrors(resolveErrors(error));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <div className="demo-login-grid" aria-label={labels.demoAccounts}>
        {demoAccounts.map((account) => (
          <button
            className="demo-login-card"
            key={account.identifier}
            type="button"
            onClick={() => {
              setFormState({ identifier: account.identifier, password: account.password });
              setErrors([]);
            }}
          >
            <span>{account.label}</span>
            <small>{account.description}</small>
          </button>
        ))}
      </div>

      <FormError errors={errors} />
      <Input
        label={labels.identifier}
        name="identifier"
        value={formState.identifier}
        placeholder="customer_demo"
        dir="ltr"
        onChange={(value) => setFormState((current) => ({ ...current, identifier: value }))}
      />
      <Input
        label={labels.password}
        name="password"
        type="password"
        value={formState.password}
        placeholder="********"
        onChange={(value) => setFormState((current) => ({ ...current, password: value }))}
      />
      <Button type="submit" isLoading={isSubmitting}>
        {labels.submit}
      </Button>
      <div className="resend-confirmation-box">
        {resendMessage ? <div className="form-success">{resendMessage}</div> : null}
        <Input
          label="لم يصلك رابط التفعيل؟"
          name="confirmationEmail"
          type="email"
          value={confirmationEmail}
          placeholder="name@example.com"
          dir="ltr"
          onChange={setConfirmationEmail}
        />
        <button className="text-button" type="button" disabled={isResending} onClick={() => void handleResendConfirmation()}>
          {isResending ? 'جار الإرسال...' : 'إعادة إرسال رابط التفعيل'}
        </button>
      </div>
    </form>
  );
}

export function validateLoginForm(formState: LoginFormState): string[] {
  const errors: string[] = [];

  if (!formState.identifier.trim()) {
    errors.push(loginMessages.identifierRequired);
  }

  if (!formState.password.trim()) {
    errors.push(loginMessages.passwordRequired);
  }

  return errors;
}

function resolveErrors(error: unknown): string[] {
  const apiError = error as Partial<ApiResponse<unknown>>;

  if (Array.isArray(apiError.errors) && apiError.errors.length > 0) {
    return apiError.errors;
  }

  return [apiError.message ?? loginMessages.fallback];
}
