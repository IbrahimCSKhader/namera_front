import { FormEvent, useEffect, useState } from 'react';
import { OwnerLayout } from '../../../shared/components/layout/OwnerLayout';
import { getStoreSettings, updateStoreSettings } from '../services/ownerApi';
import { type UpdateStoreSettingsRequest } from '../types/ownerTypes';

const emptySettings: UpdateStoreSettingsRequest = {
  storeName: '',
  contactPhone: '',
  contactEmail: '',
  instagramUrl: '',
  defaultCurrency: 'ILS',
  aboutText: '',
  ordersEnabled: true,
};

export function OwnerSettingsPage() {
  const [formState, setFormState] = useState(emptySettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await getStoreSettings();
        if (response.data) {
          setFormState({
            storeName: response.data.storeName,
            contactPhone: response.data.contactPhone,
            contactEmail: response.data.contactEmail,
            instagramUrl: response.data.instagramUrl,
            defaultCurrency: response.data.defaultCurrency,
            aboutText: response.data.aboutText,
            ordersEnabled: response.data.ordersEnabled,
          });
        }
      } catch (caughtError) {
        setError(extractError(caughtError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadSettings();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      await updateStoreSettings(formState);
      setMessage('تم تحديث إعدادات المتجر.');
    } catch (caughtError) {
      setError(extractError(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OwnerLayout>
      <section className="owner-page-heading">
        <p className="eyebrow">إعدادات المتجر</p>
        <h2>بيانات Resin Bon العامة</h2>
        <p>اضبط اسم المتجر ومعلومات التواصل وحالة استقبال الطلبات.</p>
      </section>

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل الإعدادات...</div>
      ) : (
        <form className="customer-panel form-stack owner-account-form" onSubmit={handleSubmit}>
          {error ? <div className="form-error">{error}</div> : null}
          {message ? <div className="form-success">{message}</div> : null}
          <div className="form-grid">
            <label className="field admin-field">
              اسم المتجر
              <input value={formState.storeName} onChange={(event) => setFormState((current) => ({ ...current, storeName: event.target.value }))} />
            </label>
            <label className="field admin-field">
              العملة
              <input value={formState.defaultCurrency} onChange={(event) => setFormState((current) => ({ ...current, defaultCurrency: event.target.value }))} />
            </label>
          </div>
          <div className="form-grid">
            <label className="field admin-field">
              الهاتف
              <input dir="ltr" value={formState.contactPhone} onChange={(event) => setFormState((current) => ({ ...current, contactPhone: event.target.value }))} />
            </label>
            <label className="field admin-field">
              البريد
              <input dir="ltr" value={formState.contactEmail} onChange={(event) => setFormState((current) => ({ ...current, contactEmail: event.target.value }))} />
            </label>
          </div>
          <label className="field admin-field">
            رابط إنستغرام
            <input dir="ltr" value={formState.instagramUrl} onChange={(event) => setFormState((current) => ({ ...current, instagramUrl: event.target.value }))} />
          </label>
          <label className="field admin-field">
            نبذة المتجر
            <textarea rows={5} value={formState.aboutText} onChange={(event) => setFormState((current) => ({ ...current, aboutText: event.target.value }))} />
          </label>
          <label className="toggle-row">
            <input type="checkbox" checked={formState.ordersEnabled} onChange={(event) => setFormState((current) => ({ ...current, ordersEnabled: event.target.checked }))} />
            استقبال الطلبات مفعل
          </label>
          <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'جار الحفظ...' : 'حفظ الإعدادات'}</button>
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
