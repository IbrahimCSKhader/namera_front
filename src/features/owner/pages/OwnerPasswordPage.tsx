import { FormEvent, useState } from 'react';
import { OwnerLayout } from '../../../shared/components/layout/OwnerLayout';
import { useAuth } from '../../authentication/hooks/useAuth';
import { changeOwnerPassword, confirmOwnerPasswordChange } from '../services/ownerApi';

export function OwnerPasswordPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [hasPendingVerification, setHasPendingVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await changeOwnerPassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setVerificationCode('');
      setHasPendingVerification(true);
      setMessage(response.message || 'أرسلنا كود ورابط تحقق إلى بريد صاحب المتجر.');
    } catch (caughtError) {
      setError(extractError(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirmCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setError('انتهت جلسة الدخول. سجل الدخول ثم حاول مرة أخرى.');
      return;
    }

    if (!/^\d{6}$/.test(verificationCode.trim())) {
      setError('أدخل كود التحقق المكون من 6 أرقام');
      return;
    }

    setIsConfirming(true);
    setError('');

    try {
      const response = await confirmOwnerPasswordChange({
        userId: user.id,
        code: verificationCode.trim(),
      });
      setVerificationCode('');
      setHasPendingVerification(false);
      setMessage(response.message || 'تم تغيير كلمة المرور بنجاح.');
    } catch (caughtError) {
      setError(extractError(caughtError));
    } finally {
      setIsConfirming(false);
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

      {hasPendingVerification ? (
        <form className="customer-panel form-stack owner-account-form" onSubmit={handleConfirmCode}>
          <label className="field admin-field">
            كود التحقق
            <input
              dir="ltr"
              inputMode="numeric"
              maxLength={6}
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </label>
          <button className="button button-primary" type="submit" disabled={isConfirming}>
            {isConfirming ? 'جار التأكيد...' : 'تأكيد تغيير كلمة المرور بالكود'}
          </button>
        </form>
      ) : null}
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
