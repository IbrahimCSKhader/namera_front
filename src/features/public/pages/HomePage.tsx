import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../../shared/constants/brand';
import { ROUTES } from '../../../shared/constants/routes';
import { resolveMediaUrl } from '../../../shared/utils/mediaUrl';
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
        <img src={BRAND.coverUrl} alt={`${BRAND.name} cover`} decoding="async" />
      </section>

      <section className="page-heading shop-heading">
        <p className="eyebrow">{BRAND.name}</p>
        <h1>{BRAND.tagline}</h1>
        <p>واجهة المتجر تعرض فقط البيانات المحفوظة في قاعدة البيانات.</p>
      </section>

      {products.length > 0 ? <ProductViewer products={products.slice(0, 10)} /> : null}

      <section className="shop-section">
        <div className="shop-section-heading">
          <h2>التصنيفات</h2>
          <Link to={ROUTES.categories}>عرض الكل</Link>
        </div>
        {categories.length > 0 ? (
          <div className="shop-category-grid home-category-grid">
            {categories.slice(0, 6).map((category) => (
              <Link className="shop-category-card" key={category.slug} to={`${ROUTES.products}?category=${encodeURIComponent(category.id)}`}>
                {category.imageUrl ? <img src={resolveMediaUrl(category.imageUrl)} alt={category.name} loading="lazy" decoding="async" /> : <div className="shop-category-placeholder" />}
                <div>
                  <h3>{category.name}</h3>
                  {category.description ? <p>{category.description}</p> : null}
                </div>
              </Link>
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
            {products.slice(0, 8).map((product) => (
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

function ProductViewer({ products }: { products: Product[] }) {
  const viewerProducts = [...products, ...products];

  return (
    <section className="product-viewer-section" aria-label="مختارات المنتجات">
      <div className="shop-section-heading">
        <h2>اختر المنتج</h2>
        <Link to={ROUTES.products}>عرض الكل</Link>
      </div>
      <div className="product-viewer" dir="ltr">
        <div className="product-viewer-track">
          {viewerProducts.map((product, index) => {
            const image = product.images.find((item) => item.isPrimary) ?? product.images[0];

            return (
              <Link className="product-viewer-item" key={`${product.id}-${index}`} to={ROUTES.productDetails.replace(':slug', product.slug)} dir="rtl">
                {image?.imageUrl ? (
                  <img src={resolveMediaUrl(image.imageUrl)} alt={image.altText || product.name} loading="lazy" decoding="async" />
                ) : (
                  <span className="product-viewer-placeholder" />
                )}
                <strong>{product.name}</strong>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
