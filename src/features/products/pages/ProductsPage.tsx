import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { BRAND } from '../../../shared/constants/brand';
import { ROUTES } from '../../../shared/constants/routes';
import { Pagination, paginateItems } from '../../../shared/components/ui/Pagination';
import { resolveMediaUrl } from '../../../shared/utils/mediaUrl';
import { ProductCard } from '../components/ProductCard';
import * as productApi from '../services/productApi';
import { type Product, type ProductCategory } from '../types/productTypes';

export function ProductsPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [page, setPage] = useState(1);
  const isCategoriesPage = location.pathname === ROUTES.categories;
  const pageSize = isCategoriesPage ? 9 : 10;
  const searchQuery = searchParams.get('search') ?? '';
  const selectedCategoryId = searchParams.get('category') ?? '';
  const selectedType = searchParams.get('type') ?? '';
  const selectedSort = searchParams.get('sort') ?? 'featured';

  useEffect(() => {
    async function loadStorefront() {
      try {
        setLoadError('');
        const [productsResponse, categoriesResponse] = await Promise.all([
          productApi.getProducts(),
          productApi.getCategories(),
        ]);

        setProducts(productsResponse.data ?? []);
        setCategories(categoriesResponse.data ?? []);
      } catch {
        setProducts([]);
        setCategories([]);
        setLoadError('تعذر تحميل المنتجات والتصنيفات من الخادم. حاول تحديث الصفحة.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadStorefront();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const searchableValues = [product.name, product.shortDescription, product.category.name].map((value) => value.toLowerCase());
      const matchesSearch = query ? searchableValues.some((value) => value.includes(query)) : true;
      const matchesCategory = selectedCategoryId ? product.category.id === selectedCategoryId : true;
      const matchesType = selectedType === 'custom'
        ? product.isCustomizable
        : selectedType === 'ready'
          ? !product.isCustomizable
          : true;
      return matchesSearch && matchesCategory && matchesType;
    });

    return [...filtered].sort((first, second) => {
      if (selectedSort === 'priceAsc') {
        return (first.basePrice ?? 0) - (second.basePrice ?? 0);
      }

      if (selectedSort === 'priceDesc') {
        return (second.basePrice ?? 0) - (first.basePrice ?? 0);
      }

      if (selectedSort === 'name') {
        return first.name.localeCompare(second.name, 'ar');
      }

      return Number(second.isFeatured) - Number(first.isFeatured) || Number(second.isNew) - Number(first.isNew);
    });
  }, [products, searchQuery, selectedCategoryId, selectedSort, selectedType]);

  const activeCategory = categories.find((category) => category.id === selectedCategoryId);
  const visibleProducts = paginateItems(filteredProducts, page, pageSize);
  const visibleCategories = paginateItems(categories, page, pageSize);

  useEffect(() => {
    setPage(1);
  }, [isCategoriesPage, searchParams]);

  function updateFilter(key: string, value: string) {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams, { replace: true });
  }

  function clearFilters() {
    setSearchParams({}, { replace: true });
  }

  return (
    <main className="shop-page">
      <section className="page-heading shop-heading">
        <p className="eyebrow">{BRAND.name}</p>
        <h1>{isCategoriesPage ? 'التصنيفات' : activeCategory ? activeCategory.name : 'المنتجات'}</h1>
        <p>{isCategoriesPage ? 'اختر التصنيف المناسب لعرض القطع المتاحة داخله.' : 'تظهر هنا المنتجات المنشورة والجاهزة للعرض في المتجر.'}</p>
      </section>

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل المنتجات...</div>
      ) : loadError ? (
        <p className="empty-state">{loadError}</p>
      ) : isCategoriesPage ? (
        <>
          <CategoriesGrid categories={visibleCategories} />
          <Pagination page={page} pageSize={pageSize} totalItems={categories.length} onPageChange={setPage} />
        </>
      ) : filteredProducts.length > 0 ? (
        <>
          <ProductFilters
            categories={categories}
            searchQuery={searchQuery}
            selectedCategoryId={selectedCategoryId}
            selectedSort={selectedSort}
            selectedType={selectedType}
            onChange={updateFilter}
            onClear={clearFilters}
          />
          <div className="shop-product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination page={page} pageSize={pageSize} totalItems={filteredProducts.length} onPageChange={setPage} />
        </>
      ) : (
        <p className="empty-state">{activeCategory ? 'لا توجد منتجات منشورة داخل هذا التصنيف حاليا.' : 'لا توجد منتجات منشورة حاليا.'}</p>
      )}
    </main>
  );
}

function CategoriesGrid({ categories }: { categories: ProductCategory[] }) {
  if (categories.length === 0) {
    return <p className="empty-state">لا توجد تصنيفات حاليا.</p>;
  }

  return (
    <div className="shop-category-grid public-category-list">
      {categories.map((category) => (
        <Link className="shop-category-card" key={category.id} to={`${ROUTES.products}?category=${encodeURIComponent(category.id)}`}>
          {category.imageUrl ? <img src={resolveMediaUrl(category.imageUrl)} alt={category.name} loading="lazy" decoding="async" /> : <div className="shop-category-placeholder" />}
          <div>
            <h3>{category.name}</h3>
            {category.description ? <p>{category.description}</p> : null}
          </div>
        </Link>
      ))}
    </div>
  );
}

function CategoryFilter({ activeCategoryId, categories }: { activeCategoryId: string; categories: ProductCategory[] }) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="shop-tags product-category-filter" aria-label="فلترة المنتجات حسب التصنيف">
      <Link className={!activeCategoryId ? 'active' : ''} to={ROUTES.products}>كل المنتجات</Link>
      {categories.map((category) => (
        <Link className={activeCategoryId === category.id ? 'active' : ''} key={category.id} to={`${ROUTES.products}?category=${encodeURIComponent(category.id)}`}>
          {category.name}
        </Link>
      ))}
    </div>
  );
}

function ProductFilters({
  categories,
  searchQuery,
  selectedCategoryId,
  selectedSort,
  selectedType,
  onChange,
  onClear,
}: {
  categories: ProductCategory[];
  searchQuery: string;
  selectedCategoryId: string;
  selectedSort: string;
  selectedType: string;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}) {
  return (
    <section className="product-filter-panel" aria-label="فلترة المنتجات">
      <label className="field admin-field">
        بحث
        <input value={searchQuery} placeholder="اسم المنتج أو التصنيف" onChange={(event) => onChange('search', event.target.value)} />
      </label>
      <label className="field admin-field">
        التصنيف
        <select value={selectedCategoryId} onChange={(event) => onChange('category', event.target.value)}>
          <option value="">كل التصنيفات</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </label>
      <label className="field admin-field">
        النوع
        <select value={selectedType} onChange={(event) => onChange('type', event.target.value)}>
          <option value="">كل المنتجات</option>
          <option value="custom">قابل للتخصيص</option>
          <option value="ready">جاهز</option>
        </select>
      </label>
      <label className="field admin-field">
        الترتيب
        <select value={selectedSort} onChange={(event) => onChange('sort', event.target.value)}>
          <option value="featured">المميزة أولاً</option>
          <option value="priceAsc">السعر من الأقل</option>
          <option value="priceDesc">السعر من الأعلى</option>
          <option value="name">الاسم</option>
        </select>
      </label>
      <button className="button button-secondary" type="button" onClick={onClear}>مسح الفلاتر</button>
    </section>
  );
}
