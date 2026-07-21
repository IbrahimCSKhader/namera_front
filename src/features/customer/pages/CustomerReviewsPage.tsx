import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomerLayout } from '../../../shared/components/layout/CustomerLayout';
import { ROUTES } from '../../../shared/constants/routes';
import { resolveMediaUrl } from '../../../shared/utils/mediaUrl';
import { getProducts } from '../../products/services/productApi';
import { type Product } from '../../products/types/productTypes';
import { deleteReview, getReviews, saveReview } from '../services/customerApi';
import { type CustomerReview } from '../types/customerTypes';

export function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPage() {
      try {
        const [reviewsResponse, productsResponse] = await Promise.all([getReviews(), getProducts()]);
        setReviews(reviewsResponse.data ?? []);
        const rateableProducts = (productsResponse.data ?? []).filter((product) => product.allowOrdering);
        setProducts(rateableProducts);
        setProductId(rateableProducts[0]?.id ?? '');
      } catch (caughtError) {
        setError(extractError(caughtError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadPage();
  }, []);

  const selectedReview = useMemo(
    () => reviews.find((review) => review.productId === productId),
    [productId, reviews],
  );

  useEffect(() => {
    if (selectedReview) {
      setRating(selectedReview.rating);
      setComment(selectedReview.comment);
    } else {
      setRating(5);
      setComment('');
    }
  }, [selectedReview]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      await saveReview({ productId, rating, comment });
      setMessage(selectedReview ? 'تم تحديث التقييم.' : 'تم إضافة التقييم.');
      const response = await getReviews();
      setReviews(response.data ?? []);
    } catch (caughtError) {
      setError(extractError(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeReview(reviewId: string) {
    setError('');
    setMessage('');
    try {
      await deleteReview(reviewId);
      setMessage('تم حذف التقييم.');
      const response = await getReviews();
      setReviews(response.data ?? []);
    } catch (caughtError) {
      setError(extractError(caughtError));
    }
  }

  return (
    <CustomerLayout>
      <section className="owner-page-heading split-heading">
        <div>
          <p className="eyebrow">تقييماتي</p>
          <h2>تقييم المنتجات</h2>
          <p>اكتب تقييمك للمنتجات المتاحة أو عدل تقييمك السابق لنفس المنتج.</p>
        </div>
        <Link className="button button-secondary" to={ROUTES.products}>عرض المنتجات</Link>
      </section>

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل التقييمات...</div>
      ) : (
        <section className="customer-management-grid">
          <form className="customer-panel form-stack" onSubmit={handleSubmit}>
            <h3>{selectedReview ? 'تعديل تقييم' : 'تقييم جديد'}</h3>
            {error ? <div className="form-error">{error}</div> : null}
            {message ? <div className="form-success">{message}</div> : null}
            <label className="field admin-field">
              المنتج
              <select value={productId} onChange={(event) => setProductId(event.target.value)}>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </label>
            <label className="field admin-field">
              التقييم
              <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>{value} / 5</option>
                ))}
              </select>
            </label>
            <label className="field admin-field">
              ملاحظتك
              <textarea rows={5} value={comment} onChange={(event) => setComment(event.target.value)} />
            </label>
            <button className="button button-primary" type="submit" disabled={isSubmitting || !productId}>
              {isSubmitting ? 'جار الحفظ...' : selectedReview ? 'تحديث التقييم' : 'إضافة التقييم'}
            </button>
          </form>

          <div className="customer-panel">
            {reviews.length === 0 ? (
              <p className="empty-state">لا توجد تقييمات محفوظة بعد.</p>
            ) : (
              <div className="customer-card-list">
                {reviews.map((review) => (
                  <article className="customer-card review-card" key={review.id}>
                    <header>
                      {review.productImageUrl ? <img src={resolveMediaUrl(review.productImageUrl)} alt={review.productName} loading="lazy" decoding="async" /> : null}
                      <div>
                        <h3>{review.productName}</h3>
                        <p>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                      </div>
                    </header>
                    <p>{review.comment}</p>
                    <div className="row-actions">
                      <button className="text-button" type="button" onClick={() => setProductId(review.productId)}>تعديل</button>
                      <button className="text-button danger" type="button" onClick={() => void removeReview(review.id)}>حذف</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
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
