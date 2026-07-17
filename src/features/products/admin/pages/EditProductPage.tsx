import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { OwnerLayout } from '../../../../shared/components/layout/OwnerLayout';
import { ROUTES } from '../../../../shared/constants/routes';
import { getCategories } from '../../services/productApi';
import { type ProductCategory } from '../../types/productTypes';
import { ProductForm } from '../components/ProductForm';
import {
  createAdminCategoryWithImage,
  getAdminProduct,
  updateAdminProduct,
  uploadAdminCategoryImage,
  uploadAdminProductImage,
} from '../services/adminProductService';
import { type ProductDraft, type ProductFieldErrors } from '../types/productAdminTypes';
import { createEmptyProductDraft, normalizeProductDraft } from '../utils/productDraft';
import { validateProductDraft } from '../utils/productValidation';

export function EditProductPage() {
  const { productId } = useParams();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(() => createEmptyProductDraft());
  const [errors, setErrors] = useState<ProductFieldErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void load();
  }, [productId]);

  async function load() {
    if (!productId) {
      return;
    }

    setIsLoading(true);
    const [categoriesResponse, product] = await Promise.all([getCategories(), getAdminProduct(productId)]);
    setCategories(categoriesResponse.data ?? []);
    setDraft(product);
    setIsLoading(false);
  }

  async function handleCreateCategory(name: string, imageFile?: File | null) {
    const categoryId = crypto.randomUUID();
    const uploadedImage = imageFile ? await uploadAdminCategoryImage(categoryId, imageFile) : null;
    const category = await createAdminCategoryWithImage(name, uploadedImage?.url ?? '', categoryId);
    setCategories((current) => [...current, category]);
    setDraft((current) => ({ ...current, categoryId: category.id }));
  }

  async function handleUploadProductImage(file: File) {
    const uploadedImage = await uploadAdminProductImage(draft.id, file);
    return uploadedImage.url;
  }

  async function handleSubmit() {
    if (!productId) {
      return;
    }

    const normalized = normalizeProductDraft(draft);
    const validation = validateProductDraft(normalized);
    setDraft(normalized);
    setErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    setIsSaving(true);
    setMessage('');
    try {
      const saved = await updateAdminProduct(productId, normalized);
      setDraft(saved);
      setMessage('تم تحديث المنتج بنجاح.');
    } catch {
      setMessage('تعذر تحديث المنتج. راجعي البيانات وحاولي مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <OwnerLayout>
      <div className="owner-page-heading split-heading">
        <div>
          <p className="eyebrow">إدارة المنتجات</p>
          <h2>تعديل المنتج</h2>
          <p>كل الحقول قابلة للتعديل بدون فقدان الخيارات غير المعدلة.</p>
        </div>
        <Link className="button button-secondary" to={ROUTES.ownerProducts}>
          رجوع للقائمة
        </Link>
      </div>
      {message ? <div className={message.includes('بنجاح') ? 'form-success' : 'form-error'}>{message}</div> : null}
      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل المنتج...</div>
      ) : (
        <ProductForm
          categories={categories}
          draft={draft}
          errors={errors}
          isSaving={isSaving}
          submitLabel="حفظ التعديلات"
          onChange={setDraft}
          onCreateCategory={handleCreateCategory}
          onUploadProductImage={handleUploadProductImage}
          onSubmit={handleSubmit}
        />
      )}
    </OwnerLayout>
  );
}
