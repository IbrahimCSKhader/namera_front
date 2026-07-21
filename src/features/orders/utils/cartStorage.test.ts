import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Product } from '../../products/types/productTypes';
import {
  addProductToCart,
  cartStorageKey,
  clearCart,
  getCartCount,
  readCart,
  updateCartQuantity,
} from './cartStorage';

const storage = new Map<string, string>();
const dispatchEvent = vi.fn();

const product: Product = {
  id: 'product-1',
  name: 'Custom tray',
  slug: 'custom-tray',
  shortDescription: 'Handmade tray',
  description: 'A handmade resin tray.',
  basePrice: 45,
  pricingType: 'fixed',
  isPriceVisible: true,
  priceLabel: '45 شيكل',
  currency: 'ILS',
  status: 'published',
  isFeatured: false,
  isNew: true,
  isCustomizable: true,
  hasVariants: false,
  madeToOrder: true,
  allowOrdering: true,
  minimumQuantity: 1,
  maximumQuantity: null,
  preparationTimeInDays: 3,
  preparationNote: '',
  category: {
    id: 'category-1',
    name: 'Trays',
    slug: 'trays',
    description: '',
    imageUrl: '',
  },
  images: [
    {
      id: 'image-1',
      imageUrl: '/uploads/products/tray.png',
      altText: 'Tray',
      isPrimary: true,
      displayOrder: 1,
    },
  ],
  optionGroups: [],
  customizationFields: [],
};

describe('cart storage', () => {
  beforeEach(() => {
    storage.clear();
    dispatchEvent.mockReset();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
      dispatchEvent,
    });
  });

  it('adds products and increments existing cart items', () => {
    addProductToCart(product);
    addProductToCart(product);

    expect(readCart()).toEqual([
      expect.objectContaining({
        productId: 'product-1',
        name: 'Custom tray',
        unitPrice: 45,
        quantity: 2,
      }),
    ]);
    expect(getCartCount()).toBe(2);
    expect(dispatchEvent).toHaveBeenCalledTimes(2);
  });

  it('updates quantities and removes zero quantity items', () => {
    addProductToCart(product);
    const [item] = readCart();

    updateCartQuantity(item.cartItemId, 4);
    expect(getCartCount()).toBe(4);

    updateCartQuantity(item.cartItemId, 0);
    expect(readCart()).toEqual([]);
    expect(storage.get(cartStorageKey)).toBe('[]');
  });

  it('keeps the same product separate when customizations differ', () => {
    addProductToCart(product, { customRequest: 'Gold name' });
    addProductToCart(product, { customRequest: 'Pink name' });

    const items = readCart();

    expect(items).toHaveLength(2);
    expect(items.map((item) => item.customRequest)).toEqual(['Gold name', 'Pink name']);
    expect(getCartCount()).toBe(2);
  });

  it('clears invalid stored cart values safely', () => {
    storage.set(cartStorageKey, 'not-json');

    expect(readCart()).toEqual([]);
    clearCart();
    expect(storage.get(cartStorageKey)).toBe('[]');
  });
});
