import { FormEvent, useEffect, useState } from 'react';
import { CustomerLayout } from '../../../shared/components/layout/CustomerLayout';
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from '../services/customerApi';
import { type CustomerAddress, type CustomerAddressRequest } from '../types/customerTypes';

const emptyAddress: CustomerAddressRequest = {
  label: '',
  recipientName: '',
  phoneNumber: '',
  addressLine: '',
  city: '',
  notes: '',
  isDefault: false,
};

export function CustomerAddressesPage() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [formState, setFormState] = useState<CustomerAddressRequest>(emptyAddress);
  const [editingId, setEditingId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void loadAddresses();
  }, []);

  async function loadAddresses() {
    setIsLoading(true);
    try {
      const response = await getAddresses();
      setAddresses(response.data ?? []);
    } catch (caughtError) {
      setError(extractError(caughtError));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      if (editingId) {
        await updateAddress(editingId, formState);
        setMessage('تم تحديث العنوان.');
      } else {
        await createAddress(formState);
        setMessage('تم إضافة العنوان.');
      }

      resetForm();
      await loadAddresses();
    } catch (caughtError) {
      setError(extractError(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeAddress(addressId: string) {
    setError('');
    setMessage('');
    try {
      await deleteAddress(addressId);
      setMessage('تم حذف العنوان.');
      await loadAddresses();
    } catch (caughtError) {
      setError(extractError(caughtError));
    }
  }

  function editAddress(address: CustomerAddress) {
    setEditingId(address.id);
    setFormState({
      label: address.label,
      recipientName: address.recipientName,
      phoneNumber: address.phoneNumber,
      addressLine: address.addressLine,
      city: address.city,
      notes: address.notes,
      isDefault: address.isDefault,
    });
  }

  function resetForm() {
    setEditingId('');
    setFormState(emptyAddress);
  }

  return (
    <CustomerLayout>
      <section className="owner-page-heading">
        <p className="eyebrow">العناوين</p>
        <h2>عناوين التوصيل</h2>
        <p>أضف أكثر من عنوان واختر العنوان الافتراضي الذي يظهر عند تجهيز الطلب.</p>
      </section>

      <section className="customer-management-grid">
        <form className="customer-panel form-stack" onSubmit={handleSubmit}>
          <h3>{editingId ? 'تعديل عنوان' : 'عنوان جديد'}</h3>
          {error ? <div className="form-error">{error}</div> : null}
          {message ? <div className="form-success">{message}</div> : null}
          <div className="form-grid">
            <label className="field admin-field">
              اسم العنوان
              <input value={formState.label} onChange={(event) => setFormState((current) => ({ ...current, label: event.target.value }))} />
            </label>
            <label className="field admin-field">
              اسم المستلم
              <input value={formState.recipientName} onChange={(event) => setFormState((current) => ({ ...current, recipientName: event.target.value }))} />
            </label>
          </div>
          <div className="form-grid">
            <label className="field admin-field">
              الهاتف
              <input dir="ltr" value={formState.phoneNumber} onChange={(event) => setFormState((current) => ({ ...current, phoneNumber: event.target.value }))} />
            </label>
            <label className="field admin-field">
              المدينة
              <input value={formState.city} onChange={(event) => setFormState((current) => ({ ...current, city: event.target.value }))} />
            </label>
          </div>
          <label className="field admin-field">
            العنوان التفصيلي
            <textarea rows={3} value={formState.addressLine} onChange={(event) => setFormState((current) => ({ ...current, addressLine: event.target.value }))} />
          </label>
          <label className="field admin-field">
            ملاحظات
            <textarea rows={2} value={formState.notes} onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))} />
          </label>
          <label className="toggle-row">
            <input type="checkbox" checked={formState.isDefault} onChange={(event) => setFormState((current) => ({ ...current, isDefault: event.target.checked }))} />
            اجعله العنوان الافتراضي
          </label>
          <div className="row-actions">
            <button className="button button-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'جار الحفظ...' : editingId ? 'حفظ التعديل' : 'إضافة العنوان'}
            </button>
            {editingId ? <button className="button button-secondary" type="button" onClick={resetForm}>إلغاء التعديل</button> : null}
          </div>
        </form>

        <div className="customer-panel">
          {isLoading ? (
            <div className="loading-state"><span /> جار تحميل العناوين...</div>
          ) : addresses.length === 0 ? (
            <p className="empty-state">لا توجد عناوين محفوظة بعد.</p>
          ) : (
            <div className="customer-card-list">
              {addresses.map((address) => (
                <article className="customer-card" key={address.id}>
                  <header>
                    <div>
                      <h3>{address.label}</h3>
                      <p>{address.recipientName} - {address.phoneNumber}</p>
                    </div>
                    {address.isDefault ? <span className="status-badge approved">افتراضي</span> : null}
                  </header>
                  <p>{address.city}، {address.addressLine}</p>
                  {address.notes ? <small>{address.notes}</small> : null}
                  <div className="row-actions">
                    <button className="text-button" type="button" onClick={() => editAddress(address)}>تعديل</button>
                    <button className="text-button danger" type="button" onClick={() => void removeAddress(address.id)}>حذف</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </CustomerLayout>
  );
}

function extractError(error: unknown): string {
  if (typeof error === 'object' && error && 'errors' in error && Array.isArray((error as { errors: unknown }).errors)) {
    return ((error as { errors: string[] }).errors).join(' ');
  }

  if (typeof error === 'object' && error && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }

  return 'حدث خطأ غير متوقع. حاول مرة أخرى.';
}
