import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button';
import { FormError } from '../../../shared/components/ui/FormError';
import { Input } from '../../../shared/components/ui/Input';
import { ROUTES } from '../../../shared/constants/routes';
import { type ApiResponse } from '../../../shared/types/apiResponse';
import { useAuth } from '../hooks/useAuth';

type LoginFormState = {
  phoneNumber: string;
  password: string;
};

const initialFormState: LoginFormState = {
  phoneNumber: '',
  password: '',
};

export function LoginForm() {
  const [formState, setFormState] = useState<LoginFormState>(initialFormState);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateForm(formState);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const user = await login(formState);
      navigate(user.role === 'Owner' ? ROUTES.ownerDashboard : ROUTES.customerProfile, { replace: true });
    } catch (error) {
      setErrors(resolveErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <FormError errors={errors} />
      <Input
        label="رقم الهاتف"
        name="phoneNumber"
        type="tel"
        value={formState.phoneNumber}
        placeholder="0599999999"
        dir="ltr"
        onChange={(value) => setFormState((current) => ({ ...current, phoneNumber: value }))}
      />
      <Input
        label="كلمة المرور"
        name="password"
        type="password"
        value={formState.password}
        placeholder="••••••••"
        onChange={(value) => setFormState((current) => ({ ...current, password: value }))}
      />
      <Button type="submit" isLoading={isSubmitting}>
        تسجيل الدخول
      </Button>
    </form>
  );
}

function validateForm(formState: LoginFormState): string[] {
  const errors: string[] = [];

  if (!formState.phoneNumber.trim()) {
    errors.push('رقم الهاتف مطلوب');
  }

  if (!formState.password.trim()) {
    errors.push('كلمة المرور مطلوبة');
  }

  return errors;
}

function resolveErrors(error: unknown): string[] {
  const apiError = error as Partial<ApiResponse<unknown>>;

  if (Array.isArray(apiError.errors) && apiError.errors.length > 0) {
    return apiError.errors;
  }

  return [apiError.message ?? 'تعذر تسجيل الدخول. حاول مرة أخرى.'];
}
