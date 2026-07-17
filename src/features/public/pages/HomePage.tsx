import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../../shared/constants/brand';
import { ROUTES } from '../../../shared/constants/routes';
import { ProductCard } from '../../products/components/ProductCard';
import * as productApi from '../../products/services/productApi';
import { type Product, type ProductCategory } from '../../products/types/productTypes';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  useEffect(() => {
    async function loadStorefront() {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productApi.getProducts(),
          productApi.getCategories(),
        ]);

        setProducts(productsResponse.data ?? []);
        setCategories(categoriesResponse.data ?? []);
      } catch {
        setProducts([]);
        setCategories([]);
      }
    }

    void loadStorefront();
  }, []);

  return (
    <main className="shop-page" id="products">
      <section className="store-cover" aria-label={BRAND.name}>
        <img src={BRAND.coverUrl} alt={`${BRAND.name} cover`} />
      </section>

      <section className="page-heading shop-heading">
        <p className="eyebrow">{BRAND.name}</p>
        <h1>{BRAND.tagline}</h1>
        <p>واجهة المتجر تعرض فقط البيانات المحفوظة في قاعدة البيانات.</p>
      </section>

      <section className="shop-section">
        <div className="shop-section-heading">
          <h2>التصنيفات</h2>
          <Link to={ROUTES.categories}>عرض الكل</Link>
        </div>
        {categories.length > 0 ? (
          <div className="shop-category-grid">
            {categories.slice(0, 5).map((category, index) => (
              <article className={index === 0 ? 'shop-category-card featured' : 'shop-category-card'} key={category.slug}>
                {category.imageUrl ? <img src={category.imageUrl} alt={category.name} /> : <div className="shop-category-placeholder" />}
                <div>
                  <h3>{category.name}</h3>
                  {category.description ? <p>{category.description}</p> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">لا توجد فئات حاليا.</p>
        )}
      </section>

      <section className="shop-section">
        <div className="shop-section-heading">
          <h2>المنتجات</h2>
          <Link to={ROUTES.products}>عرض جميع المنتجات</Link>
        </div>
        {products.length > 0 ? (
          <div className="shop-product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="empty-state">لا توجد منتجات حاليا.</p>
        )}
      </section>
    </main>
  );
}
