import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PublicLayout } from '../../../shared/components/layout/PublicLayout';
import { ROUTES } from '../../../shared/constants/routes';
import { confirmEmail } from '../services/authApi';

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('جار تأكيد البريد الإلكتروني...');

  useEffect(() => {
    async function confirm() {
      const userId = searchParams.get('userId') ?? '';
      const token = searchParams.get('token') ?? '';

      if (!userId || !token) {
        setStatus('error');
        setMessage('رابط التأكيد غير مكتمل.');
        return;
      }

      try {
        const response = await confirmEmail({ userId, token });
        setStatus('success');
        setMessage(response.message || 'تم تأكيد البريد الإلكتروني بنجاح.');
      } catch (error) {
        setStatus('error');
        setMessage(resolveError(error));
      }
    }

    void confirm();
  }, [searchParams]);

  return (
    <PublicLayout
      title="تأكيد البريد الإلكتروني"
      subtitle="نراجع رابط التفعيل الخاص بحسابك."
      sideTitle="خطوة صغيرة ويصير حسابك جاهزاً للطلبات"
    >
      <div className={status === 'success' ? 'form-success' : status === 'error' ? 'form-error' : 'loading-state'}>
        {status === 'loading' ? <span /> : null}
        {message}
      </div>
      <p className="auth-switch auth-switch-box">
        <Link to={ROUTES.login}>الذهاب لتسجيل الدخول</Link>
      </p>
    </PublicLayout>
  );
}

function resolveError(error: unknown): string {
  if (typeof error === 'object' && error && 'errors' in error && Array.isArray((error as { errors: unknown }).errors)) {
    return ((error as { errors: string[] }).errors).join(' ');
  }

  if (typeof error === 'object' && error && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }

  return 'تعذر تأكيد البريد الإلكتروني. حاول طلب رابط جديد.';
}
