import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OwnerLayout } from '../../../../shared/components/layout/OwnerLayout';
import { ROUTES } from '../../../../shared/constants/routes';
import { getCategories } from '../../services/productApi';
import { type ProductCategory } from '../../types/productTypes';
import { ProductForm } from '../components/ProductForm';
import { createAdminCategory, createAdminProduct } from '../services/adminProductService';
import { type ProductDraft, type ProductFieldErrors } from '../types/productAdminTypes';
import { createEmptyProductDraft, normalizeProductDraft } from '../utils/productDraft';
import { validateProductDraft } from '../utils/productValidation';

export function AddProductPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(() => createEmptyProductDraft());
  const [errors, setErrors] = useState<ProductFieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void loadCategories();
  }, []);

  async function loadCategories() {
    const response = await getCategories();
    setCategories(response.data ?? []);
  }

  async function handleCreateCategory(name: string) {
    const category = await createAdminCategory(name);
    setCategories((current) => [...current, category]);
    setDraft((current) => ({ ...current, categoryId: category.id }));
  }

  async function handleSubmit() {
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
      const saved = await createAdminProduct(normalized);
      navigate(ROUTES.ownerEditProduct.replace(':productId', saved.id), { replace: true });
    } catch (error) {
      setMessage(extractError(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <OwnerLayout>
      <div className="owner-page-heading">
        <p className="eyebrow">إدارة المنتجات</p>
        <h2>إضافة منتج جديد</h2>
        <p>أنشئي منتجًا ديناميكيًا بصور وخيارات وتخصيصات بدون تعديل الكود.</p>
      </div>
      {message ? <div className="form-error">{message}</div> : null}
      <ProductForm
        categories={categories}
        draft={draft}
        errors={errors}
        isSaving={isSaving}
        submitLabel="حفظ المنتج"
        onChange={setDraft}
        onCreateCategory={handleCreateCategory}
        onSubmit={handleSubmit}
      />
    </OwnerLayout>
  );
}

function extractError(error: unknown): string {
  if (typeof error === 'object' && error && 'errors' in error && Array.isArray((error as { errors: unknown }).errors)) {
    return ((error as { errors: string[] }).errors).join(' ');
  }

  return 'تعذر حفظ المنتج. راجعي البيانات وحاولي مرة أخرى.';
}
