import { Link } from 'react-router-dom';
import { BRAND } from '../../constants/brand';
import { ROUTES } from '../../constants/routes';

export function AppFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link className="footer-brand" to={ROUTES.home}>
          <img src={BRAND.logoUrl} alt={BRAND.name} />
          <span>{BRAND.name}</span>
        </Link>
        <nav aria-label="روابط سريعة">
          <Link to={ROUTES.products}>المنتجات</Link>
          <Link to={ROUTES.categories}>التصنيفات</Link>
          <Link to={ROUTES.contact}>تواصل</Link>
        </nav>
        <small>قطع رزِن مصممة بحب وتفاصيل شخصية.</small>
      </div>
    </footer>
  );
}
