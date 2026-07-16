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
  featuredDescription:
    '\u062e\u0644\u062f \u0630\u0643\u0631\u064a\u0627\u062a\u0643 \u0627\u0644\u062c\u0645\u064a\u0644\u0629 \u0641\u064a \u0642\u0637\u0639\u0629 \u0641\u0646\u064a\u0629',
  home: '\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629',
  products: '\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a',
  ready: '\u062c\u0627\u0647\u0632',
  searchPlaceholder:
    '\u0627\u0628\u062d\u062b \u0639\u0646 \u0642\u0637\u0639\u0629 \u0641\u0646\u064a\u0629 \u0641\u0631\u064a\u062f\u0629...',
  shop: '\u0627\u0644\u0645\u062a\u062c\u0631',
  shopNavigation:
    '\u062a\u0646\u0642\u0644 \u0627\u0644\u0645\u062a\u062c\u0631',
  customizable:
    '\u0642\u0627\u0628\u0644 \u0644\u0644\u062a\u062e\u0635\u064a\u0635',
  orderNow: '\u0627\u0637\u0644\u0628\u064a \u0627\u0644\u0622\u0646',
  trending: '\u0631\u0627\u0626\u062c \u0627\u0644\u0622\u0646',
  productCount: '\u0645\u0646\u062a\u062c\u0627\u062a',
  defaultDescription:
    '\u0642\u0637\u0639\u0629 \u064a\u062f\u0648\u064a\u0629 \u0645\u0635\u0646\u0648\u0639\u0629 \u0628\u0639\u0646\u0627\u064a\u0629 \u0648\u064a\u0645\u0643\u0646 \u062a\u062e\u0635\u064a\u0635\u0647\u0627 \u062d\u0633\u0628 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629.',
  tags: [
    '#\u0647\u062f\u0627\u064a\u0627_\u0639\u0631\u0648\u0633',
    '#\u0648\u0631\u062f_\u0637\u0628\u064a\u0639\u064a',
    '#\u062a\u062e\u0631\u062c',
    '#\u062f\u064a\u0643\u0648\u0631_\u0631\u064a\u0632\u0646',
  ],
};

const designImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCAEDmBxNRxfV61iTuF-WG5G_gj7_0HQgImM4HwwKz7MJkg3U9yHsR6lAgv28sX4HVMiwQYxlDAB5HakfzBgKaOuoDdPGth9Gs0z9qm6hToedBAGOCOT80a8cqA5iBwj0-Z9Frf9U3_FfvT6lQLB5BxdOZeIyPIE6MNHPWUiRS1eB1B_sMQzov9sK1ZXJ3iAMhk-yYTf3QUbWHgD6fiTsfMEScx3Inl59_euRfQYvQwIQ8fQKc3LzXa8YGKqtqdWkk-B6RN99l9mOet',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDrVKUiEuarb4CDFW-hp3CUfOxh-qVWFYiGncBB-cE-sSX1gTgefKpHqc-OeEoCCT2hiYmqv6_yaoc6_XJhUKI3j7dT8BvYHCE9zj_zPfdTXP9tT8T7zPe9O80hEg6Emlg12jU4g6qAF1oVTrUPkOFIu7u-aLqxOC3ISY7vD-h6TqyDTWKrmzY83JuRqZj1SPdoiAZYx5w1jOSmt3YJv0uzDvP6_VFkCJXLHW-qORIwOggwl1R0zyJmxmPwSrJGAcfaVukTeQzbnfJg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAaYwZmNAPCn3EXr0JwfyvRChm4hei5YEvNrJW_b5lJwLgSyKTTfUGdKotcml2-9BQrN8iZ8hos4sf0zQDTIjM03aEF4dlC0pJBfZ2HDU-knUz0g8hRXOcL1xPjPPPPZyUZsvawwQxGncpxMB8zA6T5qnBTujZJCTtayaaLDt5UfIdEcWIjxp8ZzQELKmUQ-ZTDquiHs92LBi8dhlqhGPtIpLNLW92ViB5gl1kOtNNNEY4XydJGozgufuztYj-0q_eW0i_ZepiEoJLr',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCMn9LDPULXdHGKgsKdO-2ZI5_1DGwQ_VjH-VimcdzxhN7o2fl8BMXazjTUQk28VdcHJgNefCAK_-6ZoXdqIqvbgdK5hPthEAbRO-ei3leEr4fh_UGryJw_arZNHGnHYANneHPFm9wHsPbDNGQHCXBtRdAxNR32EYsXB9ztAP9ejtlDanND9DBZvGZW1R8PTdgj0xH32yf7ZAl_wtZhZwxq4Wun3_Wqd6ZliTqTITOdMhI9Cg0IVrubJRCHhAIzHywnvmhoygDMEwYN',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC4kiQy17LYMqdN4q_w7MHEl7rRk3F8jvbwKIgI3DjjbbmqIp-l6gr9lKVSZ1aSOdU8haIuZ3scO95UTem45pGh42V2-9aMwWlgk9FTefgqJhK0r6INB8WcxmN5g3w-nVbP-VprtCQx4qLyq8w3wwfgUL1OaF94SDunO61c9frPw95jSpK97ZNOJ2aKlfM-T1H2-z0FBI7wXhM0i-n08ABWM1BM937AA7hSq0UrleXm2YGDBZ_zJaYlheMN3kUD3uttUn8SPa9v-rrY',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA0QYp5oMW2aNdFeRUrybX3hLumIuI99OtwxYYMDi51tNAInaKgvg-kPmpYSLMil_hGPEW3Z_GgZrJJGoeikEs3jsoJVDzxCFSmf3hRcgr4-_lIYk6lKiuj01m6rRy9myfgIvSE1TmerJMljeK-FbSra8eecuN9-4HOw9gILkl-mPUO-FdhX-leDdIv78gKMiHePhanxst58h_BxwqdMphUHdtqm025qI7KqUNvsadu0YOx8-UG_SmTOOg2K_xq86v5IDuWWh5Tt3MO',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCD8cy3-oTUISlX0PtEXKgOOb51M-074qPwE3h-_MSdVV9jJvmo2R1czy78EBSdVfxotC_5ku3XB2vK9F-qScElRUhmGufanU1-jle92LdlzxvjRdCLE43y60olgBhzR1vYtCs0jw-98PHPZ7LnG6l2htO31KLC8WqENKOZBwHNAS-HPAko-G9PD3WrVW-XcAkw8HsEYfJJhNT1gLmrpQ6bHCjc1fq6h00T9xPmn48Iw_lGldke1WRxUk6U0-fjYnzdCyq_CvfvYtXo',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBgAXR2GHU0Rw3M4KX8wNRS5WuMaelqNmt-TQKQfS17nvEqbPQjRKk_HT-OfOsMTDuKRCtQrdn-R0vtYfROwesmEN-VDp8V00DthVKFjksNL_-YIc7oxW84_aB4XP5yMkPSKx7ORxzK3aYH5aXwdUaC-pIWCVpBMiVUpQPr1kXto7Tn6w_aPYZaWmJhs2gT_Z4dH30r_NMpUFzfkiKNh9tbYfffgP4mCeMOcokiZJUMmQ8qRHH8op-MJrUTnMaNwyvu81YD7o2sR8Z7',
];

const fallbackCategories: ProductCategory[] = [
  createCategory('\u062d\u0641\u0638 \u0627\u0644\u0632\u0647\u0648\u0631', 'preserved-flowers', designImages[0]),
  createCategory('\u0645\u0631\u0627\u064a\u0627 \u0627\u0644\u0633\u064a\u0627\u0631\u0627\u062a', 'car-mirror-charms', designImages[1]),
  createCategory('\u0645\u064a\u062f\u0627\u0644\u064a\u0627\u062a', 'keychains', designImages[2]),
  createCategory('\u062a\u0637\u0631\u064a\u0632', 'embroidery', designImages[3]),
  createCategory('\u0633\u0627\u0639\u0627\u062a', 'watches', designImages[4]),
];

const fallbackProducts: Product[] = [
  createProduct('\u0628\u0644\u0648\u0643 \u062d\u0641\u0638 \u0628\u0627\u0642\u0629 \u0627\u0644\u0639\u0631\u0648\u0633', 'bridal-bouquet-resin-block', fallbackCategories[0], 180, true, 0),
  createProduct('\u0642\u0627\u0644\u0628 \u0648\u0631\u062f \u062a\u0630\u0643\u0627\u0631\u064a', 'memory-flower-cast', fallbackCategories[0], 120, true, 1),
  createProduct('\u062a\u0639\u0644\u064a\u0642\u0629 \u0645\u0631\u0622\u0629 \u0628\u0627\u0633\u0645', 'custom-name-car-charm', fallbackCategories[1], 45, true, 2),
  createProduct('\u062a\u0639\u0644\u064a\u0642\u0629 \u0633\u064a\u0627\u0631\u0629 \u062f\u0627\u0626\u0631\u064a\u0629', 'round-floral-car-charm', fallbackCategories[1], 39, false, 3),
  createProduct('\u0645\u064a\u062f\u0627\u0644\u064a\u0629 \u062d\u0631\u0641 \u0634\u0641\u0627\u0641\u0629', 'clear-letter-keychain', fallbackCategories[2], 25, true, 4),
  createProduct('\u0645\u064a\u062f\u0627\u0644\u064a\u0629 \u0627\u0633\u0645 \u0645\u0632\u062f\u0648\u062c\u0629', 'double-name-keychain', fallbackCategories[2], 32, false, 5),
  createProduct('\u0637\u0627\u0631\u0629 \u062a\u0637\u0631\u064a\u0632 \u0648\u0631\u062f\u064a\u0629', 'floral-embroidery-hoop', fallbackCategories[3], 95, true, 6),
  createProduct('\u0647\u062f\u064a\u0629 \u062a\u0637\u0631\u064a\u0632 \u0648\u0631\u064a\u0632\u0646', 'embroidery-resin-gift', fallbackCategories[3], 110, false, 7),
  createProduct('\u0633\u0627\u0639\u0629 \u0631\u064a\u0632\u0646 \u0628\u062d\u0631\u064a\u0629', 'ocean-resin-clock', fallbackCategories[4], 160, true, 0),
  createProduct('\u0633\u0627\u0639\u0629 \u064a\u062f \u0628\u062a\u0635\u0645\u064a\u0645 \u0631\u064a\u0632\u0646', 'resin-watch-face', fallbackCategories[4], 140, false, 1),
];

export function HomePage() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [categories, setCategories] = useState<ProductCategory[]>(fallbackCategories);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadStorefront() {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productApi.getProducts(),
          productApi.getCategories(),
        ]);

        if (productsResponse.data?.length) {
          setProducts(productsResponse.data);
        }

        if (categoriesResponse.data?.length) {
          setCategories(categoriesResponse.data);
        }
      } catch {
        setProducts(fallbackProducts);
        setCategories(fallbackCategories);
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
        <div className="shop-category-grid">
          {categories.slice(0, 5).map((category, index) => (
            <article className={index === 0 ? 'shop-category-card featured' : 'shop-category-card'} key={category.slug}>
              <img src={category.imageUrl || designImages[index]} alt={category.name} />
              <div>
                <h3>{category.name}</h3>
                {index === 0 ? <p>{category.description || copy.featuredDescription}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="shop-section">
        <div className="shop-section-heading">
          <h2>{copy.trending}</h2>
          <span>
            {filteredProducts.length} {copy.productCount}
          </span>
        </div>
        <div className="shop-tags">
          {copy.tags.map((tag) => (
            <button type="button" key={tag}>
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="shop-section">
        <div className="shop-section-heading">
          <h2>{copy.products}</h2>
          <Link to={ROUTES.register}>{copy.orderNow}</Link>
        </div>
        <div className="shop-product-grid">
          {filteredProducts.map((product) => {
            const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];
            return (
              <article className="shop-product-card" key={product.slug}>
                <div className="shop-product-media">
                  <img src={primaryImage?.imageUrl || designImages[0]} alt={primaryImage?.altText || product.name} />
                  <span>{product.isCustomizable ? copy.customizable : copy.ready}</span>
                </div>
                <div className="shop-product-body">
                  <small>{product.category.name}</small>
                  <h3>{product.name}</h3>
                  <p>{product.shortDescription || copy.defaultDescription}</p>
                  <strong>{product.priceLabel || (product.basePrice == null ? 'السعر عند الطلب' : `${product.basePrice.toLocaleString('ar')} ₪`)}</strong>
                </div>
              </article>
            );
          })}
        </div>
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

function createCategory(name: string, slug: string, imageUrl: string): ProductCategory {
  return {
    id: slug,
    name,
    slug,
    description: copy.featuredDescription,
    imageUrl,
  };
}

function createProduct(
  name: string,
  slug: string,
  category: ProductCategory,
  basePrice: number,
  isFeatured: boolean,
  imageOffset: number,
): Product {
  return {
    id: slug,
    name,
    slug,
    shortDescription: copy.defaultDescription,
    description: copy.defaultDescription,
    basePrice,
    pricingType: 'fixed',
    isPriceVisible: true,
    priceLabel: `${basePrice.toLocaleString('ar')} ₪`,
    currency: 'ILS',
    status: 'Active',
    isFeatured,
    isNew: false,
    isCustomizable: true,
    hasVariants: false,
    madeToOrder: false,
    allowOrdering: true,
    minimumQuantity: 1,
    maximumQuantity: 20,
    preparationTimeInDays: 5,
    preparationNote: '',
    category,
    images: Array.from({ length: 6 }, (_, index) => ({
      id: `${slug}-${index}`,
      imageUrl: designImages[(imageOffset + index) % designImages.length],
      altText: `${name} ${index + 1}`,
      isPrimary: index === 0,
      displayOrder: index + 1,
    })),
    optionGroups: [],
    customizationFields: [],
  };
}
