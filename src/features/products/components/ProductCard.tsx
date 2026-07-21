import { Link } from 'react-router-dom';
import { type Product } from '../types/productTypes';
import { resolveMediaUrl } from '../../../shared/utils/mediaUrl';
import { ROUTES } from '../../../shared/constants/routes';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];
  const productUrl = ROUTES.productDetails.replace(':slug', product.slug);

  return (
    <article className="shop-product-card">
      <div className="shop-product-media">
        {primaryImage?.imageUrl ? (
          <img src={resolveMediaUrl(primaryImage.imageUrl)} alt={primaryImage.altText || product.name} />
        ) : (
          <span className="shop-product-placeholder" />
        )}
        <span>{product.isCustomizable ? 'قابل للتخصيص' : 'جاهز'}</span>
      </div>
      <div className="shop-product-body">
        <small>{product.category.name}</small>
        <h3>{product.name}</h3>
        {product.shortDescription ? <p>{product.shortDescription}</p> : null}
        <strong>{product.priceLabel || (product.basePrice == null ? '' : `${product.basePrice.toLocaleString('ar')} ₪`)}</strong>
        <Link className="shop-add-button" to={productUrl}>عرض المنتج</Link>
      </div>
    </article>
  );
}
