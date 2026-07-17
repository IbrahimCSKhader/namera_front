import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import * as productApi from '../../../features/products/services/productApi';
import { type ProductCategory } from '../../../features/products/types/productTypes';
import { BRAND } from '../../constants/brand';
import { ROUTES } from '../../constants/routes';

const guestCartKey = 'namira_guest_cart';

type NavItem = {
  label: string;
  to: string;
  children?: NavItem[];
};

export function AppHeader() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(() => readGuestCartCount());

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await productApi.getCategories();
        setCategories(response.data ?? []);
      } catch {
        setCategories([]);
      }
    }

    void loadCategories();
  }, []);

  useEffect(() => {
    function syncCartCount() {
      setCartCount(readGuestCartCount());
    }

    window.addEventListener('storage', syncCartCount);
    window.addEventListener('namira-cart-updated', syncCartCount);

    return () => {
      window.removeEventListener('storage', syncCartCount);
      window.removeEventListener('namira-cart-updated', syncCartCount);
    };
  }, []);

  const isOwner = user?.role === 'Owner';
  const navItems = useMemo(() => (isOwner ? ownerNavItems : storeNavItems), [isOwner]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `${ROUTES.products}?search=${encodeURIComponent(query)}` : ROUTES.products);
    setIsSearchOpen(false);
    closeMenu();
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate(ROUTES.login, { replace: true });
  }

  function goToCart() {
    closeMenu();
    navigate(ROUTES.cart);
  }

  return (
    <header className="global-header">
      <div className="global-header-inner">
        <Link className="global-logo" to={ROUTES.home} onClick={closeMenu}>
          <img className="global-logo-image" src={BRAND.logoUrl} alt={BRAND.name} />
          <span>{BRAND.name}</span>
        </Link>

        <nav className="global-nav desktop-nav" aria-label="التنقل الرئيسي">
          {navItems.map((item) =>
            item.children ? (
              <div className="nav-dropdown" key={item.label}>
                <NavLink className="global-nav-link" to={item.to}>
                  {item.label}
                </NavLink>
                <div className="dropdown-menu">
                  {item.children.map((child) => (
                    <Link key={child.label} to={child.to}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink className="global-nav-link" key={item.label} to={item.to}>
                {item.label}
              </NavLink>
            ),
          )}

          {!isOwner ? (
            <div className="nav-dropdown">
              <NavLink className="global-nav-link" to={ROUTES.categories}>
                التصنيفات
              </NavLink>
              <div className="dropdown-menu">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link key={category.id} to={`${ROUTES.products}?category=${encodeURIComponent(category.id)}`}>
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <span>لا توجد تصنيفات</span>
                )}
              </div>
            </div>
          ) : null}
        </nav>

        <div className="global-actions">
          <form className={isSearchOpen ? 'header-search open' : 'header-search'} onSubmit={handleSearch}>
            <button className="icon-button" type="button" aria-label="فتح البحث" onClick={() => setIsSearchOpen((value) => !value)}>
              بحث
            </button>
            <input
              value={searchQuery}
              placeholder="ابحث عن منتج أو تصنيف"
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </form>

          {!isOwner ? (
            <button className="icon-button cart-button" type="button" onClick={goToCart} aria-label="السلة">
              السلة
              <span>{cartCount}</span>
            </button>
          ) : null}

          {isAuthenticated && !isOwner ? (
            <button className="icon-button" type="button" aria-label="الإشعارات">
              الإشعارات
            </button>
          ) : null}

          {isOwner ? (
            <button className="icon-button" type="button" aria-label="إشعارات الإدارة">
              الإشعارات
            </button>
          ) : null}

          <div className="desktop-auth-actions">
            {renderAccountActions({ isAuthenticated, isOwner, handleLogout })}
          </div>

          <button
            className="mobile-menu-button"
            type="button"
            aria-label="فتح القائمة"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <aside className={isMenuOpen ? 'mobile-drawer open' : 'mobile-drawer'} aria-hidden={!isMenuOpen}>
        <div className="mobile-drawer-header">
          <Link className="global-logo" to={ROUTES.home} onClick={closeMenu}>
            <img className="global-logo-image" src={BRAND.logoUrl} alt={BRAND.name} />
            <span>{BRAND.name}</span>
          </Link>
          <button className="text-button" type="button" onClick={closeMenu}>
            إغلاق
          </button>
        </div>

        <form className="mobile-search" onSubmit={handleSearch}>
          <input value={searchQuery} placeholder="ابحث عن منتج أو تصنيف" onChange={(event) => setSearchQuery(event.target.value)} />
          <button className="button button-primary" type="submit">بحث</button>
        </form>

        <nav className="mobile-nav" aria-label="قائمة الموبايل">
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
          {!isOwner ? (
            <>
              <Link to={ROUTES.categories} onClick={closeMenu}>التصنيفات</Link>
              {categories.map((category) => (
                <Link className="mobile-sub-link" key={category.id} to={`${ROUTES.products}?category=${encodeURIComponent(category.id)}`} onClick={closeMenu}>
                  {category.name}
                </Link>
              ))}
              <button type="button" onClick={goToCart}>السلة {cartCount}</button>
            </>
          ) : null}
          {isOwner ? ownerMenuLinks.map((item) => (
            <Link className="mobile-sub-link" key={item.label} to={item.to} onClick={closeMenu}>
              {item.label}
            </Link>
          )) : customerMenuLinks.map((item) => (
            isAuthenticated ? (
              <Link className="mobile-sub-link" key={item.label} to={item.to} onClick={closeMenu}>
                {item.label}
              </Link>
            ) : null
          ))}
          {isAuthenticated ? (
            <button type="button" onClick={handleLogout}>تسجيل الخروج</button>
          ) : (
            <div className="mobile-auth-grid">
              <Link to={ROUTES.login} onClick={closeMenu}>تسجيل الدخول</Link>
              <Link to={ROUTES.register} onClick={closeMenu}>إنشاء حساب</Link>
            </div>
          )}
        </nav>
      </aside>
      {isMenuOpen ? <button className="drawer-backdrop" type="button" aria-label="إغلاق القائمة" onClick={closeMenu} /> : null}
    </header>
  );
}

type AccountActionProps = {
  isAuthenticated: boolean;
  isOwner: boolean;
  handleLogout: () => void;
};

function renderAccountActions({ isAuthenticated, isOwner, handleLogout }: AccountActionProps) {
  if (!isAuthenticated) {
    return (
      <>
        <Link className="nav-action" to={ROUTES.login}>تسجيل الدخول</Link>
        <Link className="nav-action primary" to={ROUTES.register}>إنشاء حساب</Link>
      </>
    );
  }

  const links = isOwner ? ownerAccountLinks : customerMenuLinks;
  const label = isOwner ? 'حساب الإدارة' : 'حسابي';

  return (
    <div className="nav-dropdown account-dropdown">
      <button className="nav-action primary" type="button">{label}</button>
      <div className="dropdown-menu">
        {links.map((item) => (
          <Link key={item.label} to={item.to}>{item.label}</Link>
        ))}
        <button type="button" onClick={handleLogout}>تسجيل الخروج</button>
      </div>
    </div>
  );
}

function readGuestCartCount() {
  try {
    const rawCart = window.localStorage.getItem(guestCartKey);
    if (!rawCart) return 0;
    const parsed = JSON.parse(rawCart) as Array<{ quantity?: number }>;
    return parsed.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  } catch {
    return 0;
  }
}

const storeNavItems: NavItem[] = [
  { label: 'الرئيسية', to: ROUTES.home },
  { label: 'المنتجات', to: ROUTES.products },
  { label: 'من نحن', to: ROUTES.about },
  { label: 'تواصل معنا', to: ROUTES.contact },
];

const ownerNavItems: NavItem[] = [
  { label: 'عرض المتجر', to: ROUTES.home },
  { label: 'لوحة التحكم', to: ROUTES.ownerDashboard },
  {
    label: 'المنتجات',
    to: ROUTES.ownerProducts,
    children: [
      { label: 'جميع المنتجات', to: ROUTES.ownerProducts },
      { label: 'إضافة منتج جديد', to: ROUTES.ownerAddProduct },
      { label: 'المنتجات غير المتوفرة', to: `${ROUTES.ownerProducts}?status=unavailable` },
      { label: 'المنتجات منخفضة المخزون', to: `${ROUTES.ownerProducts}?lowStockOnly=true` },
      { label: 'المنتجات المخفية', to: `${ROUTES.ownerProducts}?status=hidden` },
    ],
  },
  {
    label: 'الطلبات',
    to: ROUTES.ownerOrders,
    children: [
      { label: 'جميع الطلبات', to: ROUTES.ownerOrders },
      { label: 'طلبات جديدة', to: `${ROUTES.ownerOrders}?status=new` },
      { label: 'قيد التجهيز', to: `${ROUTES.ownerOrders}?status=processing` },
      { label: 'جاهزة للتسليم', to: `${ROUTES.ownerOrders}?status=ready` },
      { label: 'تم شحنها', to: `${ROUTES.ownerOrders}?status=shipped` },
      { label: 'مكتملة', to: `${ROUTES.ownerOrders}?status=completed` },
      { label: 'ملغاة', to: `${ROUTES.ownerOrders}?status=cancelled` },
    ],
  },
  { label: 'التصنيفات', to: ROUTES.ownerCategories },
  { label: 'العملاء', to: ROUTES.ownerCustomers },
  { label: 'التقييمات', to: ROUTES.ownerReviews },
];

const customerMenuLinks: NavItem[] = [
  { label: 'الملف الشخصي', to: ROUTES.customerProfile },
  { label: 'طلباتي', to: ROUTES.customerOrders },
  { label: 'تقييماتي', to: ROUTES.customerReviews },
  { label: 'العناوين', to: ROUTES.customerAddresses },
];

const ownerAccountLinks: NavItem[] = [
  { label: 'الملف الشخصي', to: ROUTES.ownerProfile },
  { label: 'إعدادات المتجر', to: ROUTES.ownerSettings },
  { label: 'تغيير كلمة المرور', to: ROUTES.ownerPassword },
  { label: 'عرض المتجر', to: ROUTES.home },
];

const ownerMenuLinks: NavItem[] = [
  { label: 'جميع التصنيفات', to: ROUTES.ownerCategories },
  { label: 'إضافة تصنيف', to: `${ROUTES.ownerCategories}?action=new` },
  { label: 'ترتيب التصنيفات', to: `${ROUTES.ownerCategories}?action=sort` },
  { label: 'كل العملاء', to: ROUTES.ownerCustomers },
  { label: 'كل التقييمات', to: ROUTES.ownerReviews },
];
