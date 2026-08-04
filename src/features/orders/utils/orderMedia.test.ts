import { describe, expect, it } from 'vitest';
import { getOrderItemCustomizationDetails, getOrderItemCustomizationTextLines } from './orderMedia';

describe('order media utilities', () => {
  it('separates uploaded image urls from customization text', () => {
    const item = {
      customizationSummary: '',
      customizationDetailsJson: JSON.stringify([
        {
          label: 'طلب خاص',
          value: 'Reference color | صورة: /uploads/order-customizations/reference.webp',
        },
      ]),
    };

    const [detail] = getOrderItemCustomizationDetails(item);

    expect(detail.text).toBe('Reference color');
    expect(detail.imageUrls[0]).toContain('/uploads/order-customizations/reference.webp');
    expect(getOrderItemCustomizationTextLines(item)).toEqual(['طلب خاص: Reference color']);
  });
});
