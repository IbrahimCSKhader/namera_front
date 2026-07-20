import { FormEvent, useEffect, useState } from 'react';
import { OwnerLayout } from '../../../shared/components/layout/OwnerLayout';
import { getOwnerProfile, updateOwnerProfile } from '../services/ownerApi';
import { type UpdateOwnerProfileRequest } from '../types/ownerTypes';

const emptyProfile: UpdateOwnerProfileRequest = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  address: '',
};

export function OwnerProfilePage() {
  const [formState, setFormState] = useState(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getOwnerProfile();
        if (response.data) {
          setFormState({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phoneNumber: response.data.phoneNumber,
            email: response.data.email,
            address: response.data.address,
          });
        }
      } catch (caughtError) {
        setError(extractError(caughtError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      await updateOwnerProfile(formState);
      setMessage('تم تحديث ملف صاحب المتجر.');
    } catch (caughtError) {
      setError(extractError(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OwnerLayout>
      <section className="owner-page-heading">
        <p className="eyebrow">الملف الشخصي</p>
        <h2>بيانات صاحب المتجر</h2>
        <p>تعديل بيانات التواصل الأساسية لحساب الإدارة.</p>
      </section>

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل الملف...</div>
      ) : (
        <form className="customer-panel form-stack owner-account-form" onSubmit={handleSubmit}>
          {error ? <div className="form-error">{error}</div> : null}
          {message ? <div className="form-success">{message}</div> : null}
          <div className="form-grid">
            <label className="field admin-field">
              الاسم الأول
              <input value={formState.firstName} onChange={(event) => setFormState((current) => ({ ...current, firstName: event.target.value }))} />
            </label>
            <label className="field admin-field">
              الاسم الأخير
              <input value={formState.lastName} onChange={(event) => setFormState((current) => ({ ...current, lastName: event.target.value }))} />
            </label>
          </div>
          <div className="form-grid">
            <label className="field admin-field">
              الهاتف
              <input dir="ltr" value={formState.phoneNumber} onChange={(event) => setFormState((current) => ({ ...current, phoneNumber: event.target.value }))} />
            </label>
            <label className="field admin-field">
              البريد
              <input dir="ltr" value={formState.email} onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))} />
            </label>
          </div>
          <label className="field admin-field">
            العنوان
            <textarea rows={3} value={formState.address} onChange={(event) => setFormState((current) => ({ ...current, address: event.target.value }))} />
          </label>
          <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'جار الحفظ...' : 'حفظ البيانات'}</button>
        </form>
      )}
    </OwnerLayout>
  );
}

function extractError(error: unknown): string {
  if (typeof error === 'object' && error && 'errors' in error && Array.isArray((error as { errors: unknown }).errors)) {
    return ((error as { errors: string[] }).errors).join(' ');
  }

  if (typeof error === 'object' && error && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }

  return 'حدث خطأ غير متوقع.';
}
