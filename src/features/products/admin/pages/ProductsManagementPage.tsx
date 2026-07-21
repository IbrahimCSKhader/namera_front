import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { OwnerLayout } from '../../../../shared/components/layout/OwnerLayout';
import { Pagination, paginateItems } from '../../../../shared/components/ui/Pagination';
import { ROUTES } from '../../../../shared/constants/routes';
import { resolveMediaUrl } from '../../../../shared/utils/mediaUrl';
import { getCategories } from '../../services/productApi';
import { type ProductCategory } from '../../types/productTypes';
import { archiveAdminProduct, getAdminProducts, publishAdminProduct } from '../services/adminProductService';
import { type ProductListItem, type ProductStatus } from '../types/productAdminTypes';

export function ProductsManagementPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    void load();
  }, [search, categoryId, status]);

  async function load() {
    setIsLoading(true);
    const [productsResponse, categoriesResponse] = await Promise.all([
      getAdminProducts({ search, categoryId, status }),
      getCategories(),
    ]);
    setProducts(productsResponse);
    setCategories(categoriesResponse.data ?? []);
    setPage(1);
    setIsLoading(false);
  }

  async function togglePublish(product: ProductListItem) {
    await publishAdminProduct(product.id, product.status !== 'published');
    await load();
  }

  async function archiveProduct(product: ProductListItem) {
    await archiveAdminProduct(product.id);
    await load();
  }

  const totals = useMemo(() => {
    return {
      all: products.length,
      published: products.filter((product) => product.status === 'published').length,
      customized: products.filter((product) => product.customizationLabel === 'نعم').length,
    };
  }, [products]);
  const visibleProducts = useMemo(() => paginateItems(products, page, pageSize), [products, page, pageSize]);

  return (
    <OwnerLayout>
      <div className="owner-page-heading split-heading">
        <div>
          <p className="eyebrow">عرض المنتجات</p>
          <h2>قائمة المنتجات</h2>
          <p>ابحثي، صفّي، وانشري أو أخفي المنتجات بسرعة.</p>
        </div>
        <Link className="button button-primary" to={ROUTES.ownerAddProduct}>
          إضافة منتج جديد
        </Link>
      </div>

      <section className="owner-stats">
        <Stat label="كل المنتجات" value={totals.all} />
        <Stat label="منشورة" value={totals.published} />
        <Stat label="تحتوي تخصيص" value={totals.customized} />
      </section>

      <section className="product-filters">
        <input value={search} placeholder="بحث باسم المنتج" onChange={(event) => setSearch(event.target.value)} />
        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">كل التصنيفات</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">كل الحالات</option>
          <option value="draft">مسودة</option>
          <option value="published">منشور</option>
          <option value="hidden">مخفي</option>
          <option value="unavailable">غير متوفر</option>
          <option value="archived">مؤرشف</option>
        </select>
      </section>

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل المنتجات...</div>
      ) : (
        <div className="owner-table-wrap">
          <table className="owner-products-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>المنتج</th>
                <th>التصنيف</th>
                <th>السعر</th>
                <th>الحالة</th>
                <th>مخصص؟</th>
                <th>آخر تعديل</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.primaryImageUrl ? <img className="table-thumb" src={resolveMediaUrl(product.primaryImageUrl)} alt={product.name} loading="lazy" decoding="async" /> : <span className="table-thumb empty" />}</td>
                  <td>{product.name}</td>
                  <td>{product.categoryName}</td>
                  <td>{product.priceLabel}</td>
                  <td><StatusBadge status={product.status} /></td>
                  <td>{product.customizationLabel}</td>
                  <td>{new Date(product.updatedAt).toLocaleDateString('ar-EG')}</td>
                  <td>
                    <div className="row-actions">
                      <Link className="text-button" to={ROUTES.ownerEditProduct.replace(':productId', product.id)}>
                        تعديل
                      </Link>
                      <button className="text-button" type="button" onClick={() => togglePublish(product)}>
                        {product.status === 'published' ? 'إخفاء' : 'نشر'}
                      </button>
                      <button className="text-button danger" type="button" onClick={() => archiveProduct(product)}>
                        أرشفة
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} pageSize={pageSize} totalItems={products.length} onPageChange={setPage} />
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

function StatusBadge({ status }: { status: ProductStatus }) {
  const labels: Record<ProductStatus, string> = {
    draft: 'مسودة',
    published: 'منشور',
    hidden: 'مخفي',
    unavailable: 'غير متوفر',
    archived: 'مؤرشف',
  };

  return <span className={`status-badge ${status}`}>{labels[status]}</span>;
}
