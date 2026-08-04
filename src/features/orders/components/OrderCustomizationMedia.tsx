import { type OrderItem } from '../types/orderTypes';
import { getOrderItemCustomizationDetails } from '../utils/orderMedia';

type OrderCustomizationMediaProps = {
  item: Pick<OrderItem, 'customizationDetailsJson' | 'customizationSummary' | 'productName'>;
};

export function OrderCustomizationMedia({ item }: OrderCustomizationMediaProps) {
  const details = getOrderItemCustomizationDetails(item);

  if (details.length === 0) {
    return null;
  }

  return (
    <div className="order-customization-media">
      {details.map((detail, detailIndex) => (
        <div className="order-customization-detail" key={`${detail.label}-${detail.text}-${detailIndex}`}>
          {detail.text ? (
            <small className="order-customization-text">
              {detail.label ? <b>{detail.label}: </b> : null}
              {detail.text}
            </small>
          ) : detail.label && detail.imageUrls.length > 0 ? (
            <small className="order-customization-text"><b>{detail.label}</b></small>
          ) : null}
          {detail.imageUrls.length > 0 ? (
            <div className="order-media-grid">
              {detail.imageUrls.map((imageUrl, imageIndex) => (
                <a href={imageUrl} key={imageUrl} target="_blank" rel="noreferrer" aria-label={`فتح صورة ${item.productName}`}>
                  <img src={imageUrl} alt={`${item.productName} تخصيص ${imageIndex + 1}`} loading="lazy" decoding="async" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
