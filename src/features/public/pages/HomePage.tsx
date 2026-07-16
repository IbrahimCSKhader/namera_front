import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import * as productApi from '../../products/services/productApi';
import { type Product, type ProductCategory } from '../../products/types/productTypes';

const copy = {
  account: '\u062d\u0633\u0627\u0628\u064a',
  brand: '\u0646\u0645\u064a\u0631\u0629',
  cart: '\u0627\u0644\u0633\u0644\u0629',
  categories: '\u0627\u0644\u0641\u0626\u0627\u062a',
  home: '\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629',
  products: '\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a',
  ready: '\u062c\u0627\u0647\u0632',
  searchPlaceholder:
    '\u0627\u0628\u062d\u062b \u0639\u0646 \u0645\u0646\u062a\u062c...',
  shop: '\u0627\u0644\u0645\u062a\u062c\u0631',
  shopNavigation:
    '\u062a\u0646\u0642\u0644 \u0627\u0644\u0645\u062a\u062c\u0631',
  customizable:
    '\u0642\u0627\u0628\u0644 \u0644\u0644\u062a\u062e\u0635\u064a\u0635',
  orderNow: '\u0627\u0637\u0644\u0628\u064a \u0627\u0644\u0622\u0646',
  productCount: '\u0645\u0646\u062a\u062c\u0627\u062a',
  emptyCategories:
    '\u0644\u0627 \u062a\u0648\u062c\u062f \u0641\u0626\u0627\u062a \u062d\u0627\u0644\u064a\u0627.',
  emptyProducts:
    '\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u0646\u062a\u062c\u0627\u062a \u062d\u0627\u0644\u064a\u0627.',
};

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) =>
      [product.name, product.shortDescription, product.category.name].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [products, searchQuery]);

  return (
    <main className="shop-page" id="products">
      <header className="shop-topbar">
        <Link className="shop-avatar" to={ROUTES.login} aria-label={copy.account}>
          N
        </Link>
        <Link className="shop-logo" to={ROUTES.home}>
          {copy.brand}
        </Link>
        <button className="shop-cart-button" type="button" aria-label={copy.cart}>
          <span aria-hidden="true">{'\u25a1'}</span>
        </button>
      </header>

      <section className="shop-search-section">
        <label className="shop-search">
          <span aria-hidden="true">{'\u2315'}</span>
          <input
            value={searchQuery}
            placeholder={copy.searchPlaceholder}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <small aria-hidden="true">{'\u2630'}</small>
        </label>
      </section>

      <section className="shop-section">
        <h2>{copy.categories}</h2>
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
          <p className="empty-state">{copy.emptyCategories}</p>
        )}
      </section>

      <section className="shop-section">
        <div className="shop-section-heading">
          <h2>{copy.products}</h2>
          <span>
            {filteredProducts.length} {copy.productCount}
          </span>
        </div>
      </section>

      <section className="shop-section">
        <div className="shop-section-heading">
          <h2>{copy.products}</h2>
          <Link to={ROUTES.register}>{copy.orderNow}</Link>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="shop-product-grid">
            {filteredProducts.map((product) => {
              const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];
              return (
                <article className="shop-product-card" key={product.slug}>
                  <div className="shop-product-media">
                    {primaryImage?.imageUrl ? (
                      <img src={primaryImage.imageUrl} alt={primaryImage.altText || product.name} />
                    ) : (
                      <span className="shop-product-placeholder" />
                    )}
                    <span>{product.isCustomizable ? copy.customizable : copy.ready}</span>
                  </div>
                  <div className="shop-product-body">
                    <small>{product.category.name}</small>
                    <h3>{product.name}</h3>
                    {product.shortDescription ? <p>{product.shortDescription}</p> : null}
                    <strong>
                      {product.priceLabel || (product.basePrice == null ? '' : `${product.basePrice.toLocaleString('ar')} \u20aa`)}
                    </strong>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="empty-state">{copy.emptyProducts}</p>
        )}
      </section>

      <nav className="shop-bottom-nav" aria-label={copy.shopNavigation}>
        <Link to={ROUTES.home}>
          <span aria-hidden="true">{'\u2302'}</span>
          <small>{copy.home}</small>
        </Link>
        <a className="active" href="#products">
          <span aria-hidden="true">{'\u25a3'}</span>
          <small>{copy.shop}</small>
        </a>
        <button type="button">
          <span aria-hidden="true">{'\u25a1'}</span>
          <small>{copy.cart}</small>
        </button>
        <Link to={ROUTES.login}>
          <span aria-hidden="true">{'\u25ef'}</span>
          <small>{copy.account}</small>
        </Link>
      </nav>
    </main>
  );
}
