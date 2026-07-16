import { describe, expect, it } from 'vitest';
import { createEmptyProductDraft, calculateProductPricingSummary, normalizeProductDraft } from './productDraft';
import { validateProductDraft } from './productValidation';

describe('product draft helpers', () => {
  it('normalizes and validates an empty draft with field errors', () => {
    const draft = createEmptyProductDraft();
    const normalized = normalizeProductDraft(draft);
    const validation = validateProductDraft(normalized);

    expect(normalized.images).toHaveLength(1);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.name).toBeDefined();
    expect(validation.errors.categoryId).toBeDefined();
    expect(validation.errors['images.primary']).toBeDefined();
  });

  it('accepts a complete fixed-price draft', () => {
    const draft = normalizeProductDraft({
      ...createEmptyProductDraft('flowers'),
      name: 'بلاطة حفظ ورد',
      slug: 'flower-block',
      shortDescription: 'قطعة يدوية مخصصة',
      description: 'وصف كامل للمنتج',
      basePrice: 160,
      quantity: 12,
      images: [
        {
          id: 'image-1',
          imageUrl: 'https://example.com/primary.jpg',
          altText: 'primary',
          displayOrder: 1,
          isPrimary: true,
          addedAt: '2026-07-16T00:00:00.000Z',
        },
      ],
    });

    const validation = validateProductDraft(draft);

    expect(validation.isValid).toBe(true);
    expect(calculateProductPricingSummary(draft)).toEqual({
      unitPrice: 160,
      extraPrice: 0,
      totalPrice: 160,
      priceLabel: '١٦٠ شيكل',
      pricingTypeLabel: 'سعر ثابت',
    });
  });

  it('flags duplicate option values and inverted quantity ranges', () => {
    const draft = normalizeProductDraft({
      ...createEmptyProductDraft('gifts'),
      name: 'هدية شخصية',
      slug: 'gift-box',
      basePrice: 90,
      minOrderQuantity: 3,
      maxOrderQuantity: 2,
      quantity: 5,
      images: [
        {
          id: 'image-1',
          imageUrl: 'https://example.com/primary.jpg',
          altText: 'primary',
          displayOrder: 1,
          isPrimary: true,
          addedAt: '2026-07-16T00:00:00.000Z',
        },
      ],
      optionGroups: [
        {
          id: 'group-1',
          name: 'الحجم',
          description: '',
          isRequired: true,
          displayOrder: 1,
          isActive: true,
          values: [
            {
              id: 'value-1',
              label: 'صغير',
              extraPrice: 0,
              displayOrder: 1,
              isActive: true,
              isDefault: true,
              stockQuantity: null,
              sku: '',
              imageUrl: '',
            },
            {
              id: 'value-2',
              label: 'صغير',
              extraPrice: 10,
              displayOrder: 2,
              isActive: true,
              isDefault: false,
              stockQuantity: null,
              sku: '',
              imageUrl: '',
            },
          ],
        },
      ],
    });

    const validation = validateProductDraft(draft);

    expect(validation.isValid).toBe(false);
    expect(validation.errors.maxOrderQuantity).toBeDefined();
    expect(validation.errors['optionGroups.0.values']).toBeDefined();
  });
});
