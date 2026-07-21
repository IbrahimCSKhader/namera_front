import { type Product } from '../../products/types/productTypes';

export const cartStorageKey = 'resin_bon_guest_cart';

export type CartCustomizationOption = {
  groupId: string;
  groupName: string;
  valueId: string;
  valueLabel: string;
  extraPrice: number;
};

export type CartCustomizationField = {
  fieldId: string;
  fieldLabel: string;
  fieldType: string;
  value: string;
  selectedChoiceIds: string[];
  displayValue: string;
  additionalPrice: number;
};

export type CartCustomRequestItem = {
  text: string;
  imageUrl?: string;
};

export type CartItem = {
  cartItemId: string;
  productId: string;
  name: string;
  priceLabel: string;
  unitPrice: number;
  imageUrl: string;
  quantity: number;
  selectedOptions: CartCustomizationOption[];
  customFields: CartCustomizationField[];
  customRequest: string;
  customRequestItems: CartCustomRequestItem[];
  customizationSummary: string;
};

export function readCart(): CartItem[] {
  try {
    const rawCart = window.localStorage.getItem(cartStorageKey);
    if (!rawCart) {
      return [];
    }

    return (JSON.parse(rawCart) as CartItem[])
      .filter((item) => item.productId && item.quantity > 0)
      .map((item) => ({
        cartItemId: item.cartItemId ?? item.productId,
        productId: item.productId,
        name: item.name,
        priceLabel: item.priceLabel,
        unitPrice: item.unitPrice,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions ?? [],
        customFields: item.customFields ?? [],
        customRequest: item.customRequest ?? '',
        customRequestItems: item.customRequestItems ?? [],
        customizationSummary: item.customizationSummary ?? '',
      }));
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

export function addProductToCart(
  product: Product,
  options: {
    quantity?: number;
    selectedOptions?: CartCustomizationOption[];
    customFields?: CartCustomizationField[];
    customRequest?: string;
    customRequestItems?: CartCustomRequestItem[];
    unitPrice?: number;
    customizationSummary?: string;
  } = {},
) {
  const items = readCart();
  const image = product.images.find((item) => item.isPrimary) ?? product.images[0];
  const selectedOptions = options.selectedOptions ?? [];
  const customFields = options.customFields ?? [];
  const customRequest = (options.customRequest ?? '').trim();
  const customRequestItems = (options.customRequestItems ?? [])
    .map((item) => ({ text: item.text.trim(), imageUrl: item.imageUrl?.trim() ?? '' }))
    .filter((item) => item.text || item.imageUrl);
  const customizationSummary = options.customizationSummary ?? buildCustomizationSummary(selectedOptions, customFields, customRequest, customRequestItems);
  const cartItemId = createCartItemId(product.id, selectedOptions, customFields, customRequest, customRequestItems);
  const existing = items.find((item) => item.cartItemId === cartItemId);
  const quantity = Math.max(1, options.quantity ?? 1);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      cartItemId,
      productId: product.id,
      name: product.name,
      priceLabel: product.priceLabel,
      unitPrice: options.unitPrice ?? product.basePrice ?? 0,
      imageUrl: image?.imageUrl ?? '',
      quantity,
      selectedOptions,
      customFields,
      customRequest,
      customRequestItems,
      customizationSummary,
    });
  }

  writeCart(items);
}

export function updateCartQuantity(cartItemId: string, quantity: number) {
  const nextItems = readCart()
    .map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  writeCart(nextItems);
}

export function getCartCount() {
  return readCart().reduce((total, item) => total + item.quantity, 0);
}

function buildCustomizationSummary(
  selectedOptions: CartCustomizationOption[],
  customFields: CartCustomizationField[],
  customRequest: string,
  customRequestItems: CartCustomRequestItem[],
) {
  const parts = [
    ...selectedOptions.map((option) => `${option.groupName}: ${option.valueLabel}`),
    ...customFields.filter((field) => field.displayValue).map((field) => `${field.fieldLabel}: ${field.displayValue}`),
    ...customRequestItems.map((item, index) => `طلب خاص ${index + 1}: ${item.text || 'صورة مرفقة'}${item.imageUrl ? ' + صورة' : ''}`),
  ];

  if (customRequest) {
    parts.push(`طلب خاص: ${customRequest}`);
  }

  return parts.join(' | ');
}

function createCartItemId(
  productId: string,
  selectedOptions: CartCustomizationOption[],
  customFields: CartCustomizationField[],
  customRequest: string,
  customRequestItems: CartCustomRequestItem[],
) {
  const signature = JSON.stringify({
    productId,
    selectedOptions: selectedOptions.map((option) => [option.groupId, option.valueId]).sort(),
    customFields: customFields.map((field) => [field.fieldId, field.value, field.selectedChoiceIds.slice().sort()]).sort(),
    customRequest,
    customRequestItems: customRequestItems.map((item) => [item.text, item.imageUrl ?? '']),
  });

  let hash = 0;
  for (let index = 0; index < signature.length; index += 1) {
    hash = ((hash << 5) - hash + signature.charCodeAt(index)) | 0;
  }

  return `${productId}:${Math.abs(hash).toString(36)}`;
}
