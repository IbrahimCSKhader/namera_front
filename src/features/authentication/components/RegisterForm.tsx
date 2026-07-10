import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button';
import { FormError } from '../../../shared/components/ui/FormError';
import { Input } from '../../../shared/components/ui/Input';
import { ROUTES } from '../../../shared/constants/routes';
import { type ApiResponse } from '../../../shared/types/apiResponse';
import { useAuth } from '../hooks/useAuth';
import { type RegisterRequest } from '../types/authTypes';

export type RegisterFormState = {
  fullName: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const initialFormState: RegisterFormState = {
  fullName: '',
  phoneNumber: '',
  address: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

export function RegisterForm() {
  const [formState, setFormState] = useState<RegisterFormState>(initialFormState);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateRegisterForm(formState);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const user = await register(buildRegisterRequest(formState));
      navigate(user.role === 'Owner' ? ROUTES.ownerDashboard : ROUTES.customerDashboard, { replace: true });
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
        label="الاسم الكامل"
        name="fullName"
        value={formState.fullName}
        placeholder="مثال: ليان أحمد"
        onChange={(value) => setFormState((current) => ({ ...current, fullName: value }))}
      />
      <div className="form-grid">
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
          label="البريد الإلكتروني - اختياري"
          name="email"
          type="email"
          value={formState.email}
          placeholder="name@example.com"
          dir="ltr"
          onChange={(value) => setFormState((current) => ({ ...current, email: value }))}
        />
      </div>
      <Input
        label="العنوان"
        name="address"
        value={formState.address}
        placeholder="المدينة والمنطقة"
        onChange={(value) => setFormState((current) => ({ ...current, address: value }))}
      />
      <div className="form-grid">
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
      </div>
      <label className="terms-field">
        <input
          checked={formState.acceptTerms}
          name="acceptTerms"
          type="checkbox"
          onChange={(event) =>
            setFormState((current) => ({ ...current, acceptTerms: event.target.checked }))
          }
        />
        <span>أوافق على الشروط والأحكام وسياسة الخصوصية</span>
      </label>
      <Button type="submit" isLoading={isSubmitting}>
        إنشاء حساب زبون
      </Button>
    </form>
  );
}

export function validateRegisterForm(formState: RegisterFormState): string[] {
  const errors: string[] = [];
  const phoneDigits = formState.phoneNumber.replace(/\D/g, '');

  if (splitFullName(formState.fullName).firstName.length < 2) {
    errors.push('الاسم الكامل مطلوب');
  }

  if (phoneDigits.length < 8) {
    errors.push('رقم الهاتف مطلوب ويجب أن يحتوي 8 أرقام على الأقل');
  }

  if (formState.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
    errors.push('البريد الإلكتروني غير صالح');
  }

  if (!formState.address.trim()) {
    errors.push('العنوان مطلوب');
  }

  if (formState.password.length < 8) {
    errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  }

  if (formState.password !== formState.confirmPassword) {
    errors.push('كلمة المرور وتأكيدها غير متطابقين');
  }

  if (!formState.acceptTerms) {
    errors.push('يجب الموافقة على الشروط والأحكام');
  }

  return errors;
}

export function buildRegisterRequest(formState: RegisterFormState): RegisterRequest {
  const { firstName, lastName } = splitFullName(formState.fullName);
  const phoneDigits = formState.phoneNumber.replace(/\D/g, '');

  return {
    firstName,
    lastName,
    userName: `customer_${phoneDigits}`,
    email: formState.email.trim(),
    phoneNumber: formState.phoneNumber.trim(),
    address: formState.address.trim(),
    password: formState.password,
    confirmPassword: formState.confirmPassword,
  };
}

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const [firstName = '', ...rest] = parts;

  return {
    firstName,
    lastName: rest.join(' ') || firstName,
  };
}

function resolveErrors(error: unknown): string[] {
  const apiError = error as Partial<ApiResponse<unknown>>;

  if (Array.isArray(apiError.errors) && apiError.errors.length > 0) {
    return apiError.errors;
  }

  return [apiError.message ?? 'تعذر إنشاء الحساب. تحقق من البيانات وحاول مرة أخرى.'];
}
