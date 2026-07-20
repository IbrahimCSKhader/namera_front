import { FormEvent, useState } from 'react';
import { OwnerLayout } from '../../../shared/components/layout/OwnerLayout';
import { changeOwnerPassword } from '../services/ownerApi';

export function OwnerPasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      await changeOwnerPassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('تم تغيير كلمة المرور.');
    } catch (caughtError) {
      setError(extractError(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OwnerLayout>
      <section className="owner-page-heading">
        <p className="eyebrow">الأمان</p>
        <h2>تغيير كلمة المرور</h2>
        <p>حدّث كلمة مرور حساب الإدارة مع التحقق من كلمة المرور الحالية.</p>
      </section>

      <form className="customer-panel form-stack owner-account-form" onSubmit={handleSubmit}>
        {error ? <div className="form-error">{error}</div> : null}
        {message ? <div className="form-success">{message}</div> : null}
        <label className="field admin-field">
          كلمة المرور الحالية
          <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
        </label>
        <label className="field admin-field">
          كلمة المرور الجديدة
          <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
        </label>
        <label className="field admin-field">
          تأكيد كلمة المرور الجديدة
          <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        </label>
        <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'جار التغيير...' : 'تغيير كلمة المرور'}</button>
      </form>
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
