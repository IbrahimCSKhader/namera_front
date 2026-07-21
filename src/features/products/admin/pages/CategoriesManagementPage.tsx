import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { OwnerLayout } from '../../../../shared/components/layout/OwnerLayout';
import { resolveMediaUrl } from '../../../../shared/utils/mediaUrl';
import {
  type AdminProductCategory,
  type ProductCategoryDraft,
  createAdminCategoryWithImage,
  getAdminCategories,
  setAdminCategoryActive,
  updateAdminCategory,
  uploadAdminCategoryImage,
} from '../services/adminProductService';
import { createGuid } from '../utils/productDraft';

const emptyDraft: ProductCategoryDraft = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  displayOrder: 1,
  isActive: true,
};

export function CategoriesManagementPage() {
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [draft, setDraft] = useState<ProductCategoryDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void loadCategories();
  }, []);

  const totals = useMemo(() => {
    return {
      all: categories.length,
      active: categories.filter((category) => category.isActive).length,
      visibleProducts: categories.reduce((total, category) => total + category.visibleProductsCount, 0),
    };
  }, [categories]);

  async function loadCategories() {
    setIsLoading(true);
    try {
      setCategories(await getAdminCategories());
    } finally {
      setIsLoading(false);
    }
  }

  function updateDraft<K extends keyof ProductCategoryDraft>(key: K, value: ProductCategoryDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function editCategory(category: AdminProductCategory) {
    setEditingId(category.id);
    setDraft({
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      displayOrder: category.displayOrder,
      isActive: category.isActive,
    });
    setImageFile(null);
    setError('');
    setMessage('');
  }

  function resetForm() {
    setEditingId(null);
    setDraft({
      ...emptyDraft,
      displayOrder: categories.length + 1,
    });
    setImageFile(null);
  }

  async function submitCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      setError('اسم التصنيف مطلوب.');
      return;
    }

    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const categoryId = editingId ?? createGuid();
      const uploadedImage = imageFile ? await uploadAdminCategoryImage(categoryId, imageFile) : null;
      const normalizedDraft = {
        ...draft,
        name,
        slug: draft.slug.trim(),
        description: draft.description.trim(),
        imageUrl: uploadedImage?.url ?? draft.imageUrl.trim(),
        displayOrder: Number.isFinite(draft.displayOrder) && draft.displayOrder > 0 ? draft.displayOrder : categories.length + 1,
      };

      if (editingId) {
        await updateAdminCategory(editingId, normalizedDraft);
        setMessage('تم تحديث التصنيف بنجاح.');
      } else {
        await createAdminCategoryWithImage(name, normalizedDraft.imageUrl, categoryId, normalizedDraft.displayOrder);
        setMessage('تم إنشاء التصنيف بنجاح.');
      }

      resetForm();
      await loadCategories();
    } catch (caughtError) {
      setError(extractError(caughtError));
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleCategory(category: AdminProductCategory) {
    setError('');
    setMessage('');
    try {
      await setAdminCategoryActive(category.id, !category.isActive);
      await loadCategories();
      setMessage(category.isActive ? 'تم تعطيل التصنيف.' : 'تم تفعيل التصنيف.');
    } catch (caughtError) {
      setError(extractError(caughtError));
    }
  }

  return (
    <OwnerLayout>
      <div className="owner-page-heading split-heading">
        <div>
          <p className="eyebrow">إدارة المنتجات</p>
          <h2>إدارة التصنيفات</h2>
          <p>أضيفي وعدّلي ورتّبي التصنيفات التي تظهر في المتجر، وتابعي عدد المنتجات المرتبطة بكل تصنيف.</p>
        </div>
        {editingId ? (
          <button className="button button-secondary" type="button" onClick={resetForm}>
            إلغاء التعديل
          </button>
        ) : null}
      </div>

      <section className="owner-stats">
        <Stat label="كل التصنيفات" value={totals.all} />
        <Stat label="تصنيفات فعالة" value={totals.active} />
        <Stat label="منتجات ظاهرة" value={totals.visibleProducts} />
      </section>

      <form className="category-management-form" onSubmit={submitCategory}>
        <div className="form-grid">
          <label className="field admin-field">
            اسم التصنيف
            <input value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} />
          </label>
          <label className="field admin-field">
            الرابط
            <input value={draft.slug} placeholder="يولد تلقائيا عند تركه فارغا" onChange={(event) => updateDraft('slug', event.target.value)} />
          </label>
          <label className="field admin-field">
            ترتيب الظهور
            <input min="1" type="number" value={draft.displayOrder} onChange={(event) => updateDraft('displayOrder', Number(event.target.value))} />
          </label>
          <label className="toggle-field category-active-toggle">
            <input checked={draft.isActive} type="checkbox" onChange={(event) => updateDraft('isActive', event.target.checked)} />
            التصنيف فعال ويظهر في المتجر
          </label>
        </div>
        <label className="field admin-field">
          الوصف
          <textarea rows={3} value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} />
        </label>
        <div className="category-media-row">
          <label className="field admin-field">
            رابط الصورة
            <input value={draft.imageUrl} onChange={(event) => updateDraft('imageUrl', event.target.value)} />
          </label>
          <label className="file-picker-inline">
            رفع صورة
            <input accept="image/*" type="file" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} />
            <span>{imageFile?.name ?? 'اختيار صورة من الجهاز'}</span>
          </label>
          {draft.imageUrl ? <img className="category-form-preview" src={resolveMediaUrl(draft.imageUrl)} alt={draft.name || 'تصنيف'} loading="lazy" decoding="async" /> : null}
        </div>

        {error ? <div className="form-error">{error}</div> : null}
        {message ? <div className="form-success">{message}</div> : null}

        <div className="form-actions">
          <button className="button button-primary" type="submit" disabled={isSaving}>
            {isSaving ? 'جار الحفظ...' : editingId ? 'حفظ التعديل' : 'إضافة التصنيف'}
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل التصنيفات...</div>
      ) : (
        <div className="owner-table-wrap">
          <table className="owner-products-table category-management-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>التصنيف</th>
                <th>الرابط</th>
                <th>الحالة</th>
                <th>المنتجات</th>
                <th>الظاهرة للزبائن</th>
                <th>الترتيب</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    {category.imageUrl ? <img className="table-thumb" src={resolveMediaUrl(category.imageUrl)} alt={category.name} loading="lazy" decoding="async" /> : <span className="table-thumb empty" />}
                  </td>
                  <td>
                    <strong>{category.name}</strong>
                    {category.description ? <small className="table-subtext">{category.description}</small> : null}
                  </td>
                  <td>{category.slug}</td>
                  <td><span className={category.isActive ? 'status-badge published' : 'status-badge hidden'}>{category.isActive ? 'فعال' : 'معطل'}</span></td>
                  <td>{category.productsCount}</td>
                  <td>{category.visibleProductsCount}</td>
                  <td>{category.displayOrder}</td>
                  <td>
                    <div className="row-actions">
                      <button className="text-button" type="button" onClick={() => editCategory(category)}>
                        تعديل
                      </button>
                      <button className={category.isActive ? 'text-button danger' : 'text-button'} type="button" onClick={() => void toggleCategory(category)}>
                        {category.isActive ? 'تعطيل' : 'تفعيل'}
                      </button>
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

  return 'تعذر حفظ التصنيف. راجع البيانات وحاول مرة أخرى.';
}
