import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { BRAND } from '../../../shared/constants/brand';
import { ROUTES } from '../../../shared/constants/routes';
import { resolveMediaUrl } from '../../../shared/utils/mediaUrl';
import { ProductCard } from '../components/ProductCard';
import * as productApi from '../services/productApi';
import { type Product, type ProductCategory } from '../types/productTypes';

export function ProductsPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const isCategoriesPage = location.pathname === ROUTES.categories;

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
    const query = (searchParams.get('search') ?? '').trim().toLowerCase();
    const categoryId = searchParams.get('category') ?? '';

    return products.filter((product) => {
      const searchableValues = [product.name, product.shortDescription, product.category.name].map((value) => value.toLowerCase());
      const matchesSearch = query ? searchableValues.some((value) => value.includes(query)) : true;
      const matchesCategory = categoryId ? product.category.id === categoryId : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchParams]);

  const activeCategory = categories.find((category) => category.id === searchParams.get('category'));

  return (
    <main className="shop-page">
      <section className="page-heading shop-heading">
        <p className="eyebrow">{BRAND.name}</p>
        <h1>{isCategoriesPage ? 'التصنيفات' : activeCategory ? activeCategory.name : 'المنتجات'}</h1>
        <p>{isCategoriesPage ? 'اختاري التصنيف المناسب لعرض القطع المتاحة داخله.' : 'تظهر هنا المنتجات المنشورة والجاهزة للعرض في المتجر.'}</p>
      </section>

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل المنتجات...</div>
      ) : loadError ? (
        <p className="empty-state">{loadError}</p>
      ) : isCategoriesPage ? (
        <CategoriesGrid categories={categories} />
      ) : filteredProducts.length > 0 ? (
        <>
          <CategoryFilter activeCategoryId={activeCategory?.id ?? ''} categories={categories} />
          <div className="shop-product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
      {categories.map((category, index) => (
        <Link className={index === 0 ? 'shop-category-card featured' : 'shop-category-card'} key={category.id} to={`${ROUTES.products}?category=${encodeURIComponent(category.id)}`}>
          {category.imageUrl ? <img src={resolveMediaUrl(category.imageUrl)} alt={category.name} /> : <div className="shop-category-placeholder" />}
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
