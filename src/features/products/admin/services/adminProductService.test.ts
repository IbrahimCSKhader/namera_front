import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../../../shared/services/api/apiClient';
import { createAdminProduct } from './adminProductService';
import { createEmptyProductDraft, normalizeProductDraft } from '../utils/productDraft';

vi.mock('../../../../shared/services/api/apiClient', () => ({
  apiClient: vi.fn(),
}));

const mockedApiClient = vi.mocked(apiClient);

describe('admin product service', () => {
  beforeEach(() => {
    mockedApiClient.mockReset();
  });

  it('sends a complete product creation payload to the admin API', async () => {
    const categoryId = '0b236bc2-2993-4d4d-903c-346cd39c3cd6';
    const draft = normalizeProductDraft({
      ...createEmptyProductDraft(categoryId),
      name: 'Resin tray test',
      slug: 'resin-tray-test',
      shortDescription: 'Custom handmade tray',
      description: 'A complete product used to verify the owner add-product flow.',
      basePrice: 120,
      quantity: 7,
      images: [
        {
          id: 'image-1',
          imageUrl: '/uploads/products/product-1/images/primary.png',
          altText: 'Primary tray image',
          displayOrder: 1,
          isPrimary: true,
          addedAt: '2026-07-17T00:00:00.000Z',
        },
      ],
    });

    mockedApiClient.mockResolvedValueOnce({
      success: true,
      message: 'created',
      data: {
        ...draft,
        minimumQuantity: draft.minOrderQuantity,
        maximumQuantity: draft.maxOrderQuantity,
        images: draft.images,
        optionGroups: [],
        customizationFields: [],
      },
      errors: [],
    });

    const created = await createAdminProduct(draft);

    expect(created.id).toBe(draft.id);
    expect(mockedApiClient).toHaveBeenCalledWith('/admin/products', {
      method: 'POST',
      body: expect.objectContaining({
        clientId: draft.id,
        name: 'Resin tray test',
        slug: 'resin-tray-test',
        categoryId,
        status: 'draft',
        pricingType: 'fixed',
        basePrice: 120,
        quantity: 7,
        images: [
          {
            imageUrl: '/uploads/products/product-1/images/primary.png',
            altText: 'Primary tray image',
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      }),
    });
  });
});
