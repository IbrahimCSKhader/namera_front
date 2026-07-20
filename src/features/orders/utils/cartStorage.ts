import { type Product } from '../../products/types/productTypes';

export const cartStorageKey = 'resin_bon_guest_cart';

export type CartItem = {
  productId: string;
  name: string;
  priceLabel: string;
  unitPrice: number;
  imageUrl: string;
  quantity: number;
};

export function readCart(): CartItem[] {
  try {
    const rawCart = window.localStorage.getItem(cartStorageKey);
    if (!rawCart) {
      return [];
    }

    return (JSON.parse(rawCart) as CartItem[]).filter((item) => item.productId && item.quantity > 0);
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event('resin-bon-cart-updated'));
}

export function clearCart() {
  writeCart([]);
}

export function addProductToCart(product: Product) {
  const items = readCart();
  const existing = items.find((item) => item.productId === product.id);
  const image = product.images.find((item) => item.isPrimary) ?? product.images[0];

  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({
      productId: product.id,
      name: product.name,
      priceLabel: product.priceLabel,
      unitPrice: product.basePrice ?? 0,
      imageUrl: image?.imageUrl ?? '',
      quantity: 1,
    });
  }

  writeCart(items);
}

export function updateCartQuantity(productId: string, quantity: number) {
  const nextItems = readCart()
    .map((item) => (item.productId === productId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  writeCart(nextItems);
}

export function getCartCount() {
  return readCart().reduce((total, item) => total + item.quantity, 0);
}
