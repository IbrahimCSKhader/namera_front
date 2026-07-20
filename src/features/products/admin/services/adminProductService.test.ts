import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../../../shared/services/api/apiClient';
import {
  createAdminProduct,
  getAdminCategories,
  setAdminCategoryActive,
  updateAdminCategory,
} from './adminProductService';
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

  it('loads admin categories including product counters and inactive items', async () => {
    mockedApiClient.mockResolvedValueOnce({
      success: true,
      message: 'loaded',
      data: [
        {
          id: 'category-1',
          name: 'Resin trays',
          slug: 'resin-trays',
          description: 'Custom trays',
          imageUrl: '/uploads/categories/trays.png',
          isActive: false,
          displayOrder: 3,
          productsCount: 4,
          visibleProductsCount: 1,
          createdAt: '2026-07-20T00:00:00.000Z',
          updatedAt: null,
        },
      ],
      errors: [],
    });

    const categories = await getAdminCategories();

    expect(categories).toHaveLength(1);
    expect(categories[0]).toMatchObject({
      id: 'category-1',
      isActive: false,
      productsCount: 4,
      visibleProductsCount: 1,
    });
    expect(mockedApiClient).toHaveBeenCalledWith('/admin/products/categories');
  });

  it('sends a category update payload to the admin API', async () => {
    mockedApiClient.mockResolvedValueOnce({
      success: true,
      message: 'updated',
      data: {
        id: 'category-2',
        name: 'Wall art',
        slug: 'wall-art',
        description: 'Resin wall pieces',
        imageUrl: '/uploads/categories/wall-art.png',
        isActive: true,
        displayOrder: 2,
        productsCount: 0,
        visibleProductsCount: 0,
        createdAt: '2026-07-20T00:00:00.000Z',
        updatedAt: '2026-07-20T01:00:00.000Z',
      },
      errors: [],
    });

    await updateAdminCategory('category-2', {
      name: 'Wall art',
      slug: 'wall-art',
      description: 'Resin wall pieces',
      imageUrl: '/uploads/categories/wall-art.png',
      displayOrder: 2,
      isActive: true,
    });

    expect(mockedApiClient).toHaveBeenCalledWith('/admin/products/categories/category-2', {
      method: 'PUT',
      body: {
        name: 'Wall art',
        slug: 'wall-art',
        description: 'Resin wall pieces',
        imageUrl: '/uploads/categories/wall-art.png',
        displayOrder: 2,
        isActive: true,
      },
    });
  });

  it('toggles category visibility through the admin API', async () => {
    mockedApiClient.mockResolvedValueOnce({
      success: true,
      message: 'disabled',
      data: {
        id: 'category-3',
        name: 'Keychains',
        slug: 'keychains',
        description: '',
        imageUrl: '',
        isActive: false,
        displayOrder: 5,
        productsCount: 2,
        visibleProductsCount: 0,
        createdAt: '2026-07-20T00:00:00.000Z',
        updatedAt: '2026-07-20T01:00:00.000Z',
      },
      errors: [],
    });

    const category = await setAdminCategoryActive('category-3', false);

    expect(category.isActive).toBe(false);
    expect(mockedApiClient).toHaveBeenCalledWith('/admin/products/categories/category-3/active?active=false', {
      method: 'PATCH',
    });
  });
});
