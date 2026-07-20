import { useEffect, useMemo, useState } from 'react';
import { OwnerLayout } from '../../../shared/components/layout/OwnerLayout';
import {
  deleteOwnerReview,
  getOwnerReviews,
  setOwnerReviewVisibility,
} from '../services/ownerApi';
import { type OwnerReview } from '../types/ownerTypes';

export function OwnerReviewsPage() {
  const [reviews, setReviews] = useState<OwnerReview[]>([]);
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void loadReviews();
  }, [visibilityFilter]);

  async function loadReviews() {
    setIsLoading(true);
    setError('');
    try {
      const visible = visibilityFilter === 'all' ? undefined : visibilityFilter === 'visible';
      const response = await getOwnerReviews(visible);
      setReviews(response.data ?? []);
    } catch (caughtError) {
      setError(extractError(caughtError));
    } finally {
      setIsLoading(false);
    }
  }

  async function updateVisibility(reviewId: string, isVisible: boolean) {
    setMessage('');
    setError('');
    try {
      await setOwnerReviewVisibility(reviewId, isVisible);
      setMessage('تم تحديث حالة التقييم.');
      await loadReviews();
    } catch (caughtError) {
      setError(extractError(caughtError));
    }
  }

  async function removeReview(reviewId: string) {
    setMessage('');
    setError('');
    try {
      await deleteOwnerReview(reviewId);
      setMessage('تم حذف التقييم.');
      await loadReviews();
    } catch (caughtError) {
      setError(extractError(caughtError));
    }
  }

  const stats = useMemo(() => ({
    all: reviews.length,
    visible: reviews.filter((review) => review.isVisible).length,
    hidden: reviews.filter((review) => !review.isVisible).length,
  }), [reviews]);

  return (
    <OwnerLayout>
      <section className="owner-page-heading">
        <p className="eyebrow">التقييمات</p>
        <h2>مراجعات الزبائن</h2>
        <p>راجع تقييمات المنتجات وأخفِ أو أظهر ما يظهر للزبائن.</p>
      </section>

      <section className="owner-stats">
        <Stat label="كل التقييمات" value={stats.all} />
        <Stat label="ظاهرة" value={stats.visible} />
        <Stat label="مخفية" value={stats.hidden} />
      </section>

      <section className="product-filters owner-customer-filters">
        <select value={visibilityFilter} onChange={(event) => setVisibilityFilter(event.target.value)}>
          <option value="all">كل التقييمات</option>
          <option value="visible">الظاهرة فقط</option>
          <option value="hidden">المخفية فقط</option>
        </select>
      </section>

      {message ? <div className="form-success">{message}</div> : null}
      {error ? <div className="form-error">{error}</div> : null}

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل التقييمات...</div>
      ) : reviews.length === 0 ? (
        <p className="empty-state">لا توجد تقييمات مطابقة.</p>
      ) : (
        <div className="owner-table-wrap">
          <table className="owner-products-table">
            <thead>
              <tr>
                <th>المنتج</th>
                <th>الزبون</th>
                <th>التقييم</th>
                <th>النص</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>
                    <strong>{review.productName}</strong>
                    <small className="table-subtext">{review.productSlug}</small>
                  </td>
                  <td>
                    {review.customerName}
                    <small className="table-subtext">{review.customerPhoneNumber}</small>
                  </td>
                  <td>{review.rating} / 5</td>
                  <td>{review.comment}</td>
                  <td><span className={review.isVisible ? 'status-badge published' : 'status-badge hidden'}>{review.isVisible ? 'ظاهر' : 'مخفي'}</span></td>
                  <td>
                    <div className="row-actions">
                      <button className="text-button" type="button" onClick={() => void updateVisibility(review.id, !review.isVisible)}>
                        {review.isVisible ? 'إخفاء' : 'إظهار'}
                      </button>
                      <button className="text-button danger" type="button" onClick={() => void removeReview(review.id)}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </OwnerLayout>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
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
