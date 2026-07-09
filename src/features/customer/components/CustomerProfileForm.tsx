import { FormEvent, useEffect, useState } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { FormError } from '../../../shared/components/ui/FormError';
import { Input } from '../../../shared/components/ui/Input';
import { LoadingSpinner } from '../../../shared/components/ui/LoadingSpinner';
import { type ApiResponse } from '../../../shared/types/apiResponse';
import * as customerApi from '../services/customerApi';
import { type UpdateCustomerProfileRequest } from '../types/customerTypes';

const emptyProfile: UpdateCustomerProfileRequest = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  address: '',
};

export function CustomerProfileForm() {
  const [formState, setFormState] = useState<UpdateCustomerProfileRequest>(emptyProfile);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await customerApi.getProfile();

        if (response.data) {
          setFormState({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phoneNumber: response.data.phoneNumber,
            address: response.data.address,
          });
        }
      } catch (error) {
        setErrors(resolveErrors(error));
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, []);

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
      const response = await customerApi.updateProfile(formState);

      if (response.data) {
        setFormState({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phoneNumber: response.data.phoneNumber,
          address: response.data.address,
        });
      }

      setSuccessMessage(response.message || 'تم حفظ التغييرات بنجاح');
    } catch (error) {
      setErrors(resolveErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <LoadingSpinner label="جاري تحميل الملف الشخصي..." />;
  }

  return (
    <form className="profile-card form-stack" onSubmit={handleSubmit}>
      <FormError errors={errors} />
      {successMessage ? <p className="form-success">{successMessage}</p> : null}
      <div className="form-grid">
        <Input
          label="الاسم الأول"
          name="firstName"
          value={formState.firstName}
          onChange={(value) => setFormState((current) => ({ ...current, firstName: value }))}
        />
        <Input
          label="الاسم الأخير"
          name="lastName"
          value={formState.lastName}
          onChange={(value) => setFormState((current) => ({ ...current, lastName: value }))}
        />
      </div>
      <Input
        label="رقم الهاتف"
        name="phoneNumber"
        type="tel"
        dir="ltr"
        value={formState.phoneNumber}
        onChange={(value) => setFormState((current) => ({ ...current, phoneNumber: value }))}
      />
      <Input
        label="العنوان"
        name="address"
        value={formState.address}
        onChange={(value) => setFormState((current) => ({ ...current, address: value }))}
      />
      <Button type="submit" isLoading={isSubmitting}>
        حفظ التغييرات
      </Button>
    </form>
  );
}

function validateForm(formState: UpdateCustomerProfileRequest): string[] {
  const errors: string[] = [];

  if (!formState.firstName.trim()) errors.push('الاسم الأول مطلوب');
  if (!formState.lastName.trim()) errors.push('الاسم الأخير مطلوب');
  if (!formState.phoneNumber.trim()) errors.push('رقم الهاتف مطلوب');
  if (!formState.address.trim()) errors.push('العنوان مطلوب');

  return errors;
}

function resolveErrors(error: unknown): string[] {
  const apiError = error as Partial<ApiResponse<unknown>>;

  if (Array.isArray(apiError.errors) && apiError.errors.length > 0) {
    return apiError.errors;
  }

  return [apiError.message ?? 'حدث خطأ غير متوقع. حاول مرة أخرى.'];
}
