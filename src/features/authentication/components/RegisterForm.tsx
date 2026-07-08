import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button';
import { FormError } from '../../../shared/components/ui/FormError';
import { Input } from '../../../shared/components/ui/Input';
import { ROUTES } from '../../../shared/constants/routes';
import { type ApiResponse } from '../../../shared/types/apiResponse';
import { useAuth } from '../hooks/useAuth';
import { type RegisterRequest } from '../types/authTypes';

const initialFormState: RegisterRequest = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  address: '',
  password: '',
  confirmPassword: '',
};

export function RegisterForm() {
  const [formState, setFormState] = useState<RegisterRequest>(initialFormState);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateForm(formState);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);
    setSuccessMessage('');

    try {
      await register(formState);
      setSuccessMessage('تم إنشاء الحساب بنجاح. يمكنك تسجيل الدخول الآن.');
      window.setTimeout(() => navigate(ROUTES.login, { replace: true }), 700);
    } catch (error) {
      setErrors(resolveErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <FormError errors={errors} />
      {successMessage ? <p className="form-success">{successMessage}</p> : null}
      <div className="form-grid">
        <Input
          label="الاسم الأول"
          name="firstName"
          value={formState.firstName}
          placeholder="إبراهيم"
          onChange={(value) => setFormState((current) => ({ ...current, firstName: value }))}
        />
        <Input
          label="الاسم الأخير"
          name="lastName"
          value={formState.lastName}
          placeholder="أبو هنية"
          onChange={(value) => setFormState((current) => ({ ...current, lastName: value }))}
        />
      </div>
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
        label="العنوان"
        name="address"
        value={formState.address}
        placeholder="رام الله"
        onChange={(value) => setFormState((current) => ({ ...current, address: value }))}
      />
      <Input
        label="كلمة المرور"
        name="password"
        type="password"
        value={formState.password}
        placeholder="••••••••"
        onChange={(value) => setFormState((current) => ({ ...current, password: value }))}
      />
      <Input
        label="تأكيد كلمة المرور"
        name="confirmPassword"
        type="password"
        value={formState.confirmPassword}
        placeholder="••••••••"
        onChange={(value) => setFormState((current) => ({ ...current, confirmPassword: value }))}
      />
      <Button type="submit" isLoading={isSubmitting}>
        إنشاء الحساب
      </Button>
    </form>
  );
}

function validateForm(formState: RegisterRequest): string[] {
  const errors: string[] = [];

  if (!formState.firstName.trim()) errors.push('الاسم الأول مطلوب');
  if (!formState.lastName.trim()) errors.push('الاسم الأخير مطلوب');
  if (!formState.phoneNumber.trim()) errors.push('رقم الهاتف مطلوب');
  if (!formState.address.trim()) errors.push('العنوان مطلوب');
  if (formState.password.length < 8) errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  if (formState.password !== formState.confirmPassword) errors.push('كلمة المرور وتأكيدها غير متطابقين');

  return errors;
}

function resolveErrors(error: unknown): string[] {
  const apiError = error as Partial<ApiResponse<unknown>>;

  if (Array.isArray(apiError.errors) && apiError.errors.length > 0) {
    return apiError.errors;
  }

  return [apiError.message ?? 'تعذر إنشاء الحساب. حاول مرة أخرى.'];
}
