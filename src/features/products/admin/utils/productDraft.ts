import {
  type ProductDraft,
  type ProductImageDraft,
  type ProductListItem,
  type ProductPricingSummary,
} from '../types/productAdminTypes';

export function createEmptyProductDraft(categoryId = ''): ProductDraft {
  return {
    id: createGuid(),
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    categoryId,
    status: 'draft',
    pricingType: 'fixed',
    basePrice: null,
    isPriceVisible: true,
    priceLabel: '',
    currency: 'ILS',
    hasVariants: false,
    optionGroups: [],
    customizationFields: [],
    images: [createEmptyImage(true)],
    inventoryTrackingEnabled: true,
    quantity: 0,
    lowStockThreshold: 3,
    madeToOrder: false,
    allowBackorder: false,
    minPreparationDays: 3,
    maxPreparationDays: 5,
    preparationUnit: 'days',
    preparationNote: '',
    minOrderQuantity: 1,
    maxOrderQuantity: null,
    allowMultiplePieces: true,
    applyCustomizationsPerUnit: true,
    showOnHomepage: false,
    isFeatured: false,
    isNew: true,
    showInSuggestions: true,
    directAccessOnly: false,
    allowRatings: true,
    allowOrdering: true,
    displayOrder: 0,
    visibleFrom: '',
    visibleTo: '',
    customTags: [],
  };
}

export function createEmptyImage(isPrimary = false): ProductImageDraft {
  return {
    id: createId('image'),
    imageUrl: '',
    altText: '',
    displayOrder: isPrimary ? 1 : 2,
    isPrimary,
    addedAt: new Date().toISOString(),
  };
}

export function normalizeProductDraft(draft: ProductDraft): ProductDraft {
  const images = sortByOrder(
    draft.images.map((image, index) => ({
      ...image,
      imageUrl: image.imageUrl.trim(),
      altText: image.altText.trim(),
      displayOrder: Number.isFinite(image.displayOrder) ? image.displayOrder : index + 1,
    })),
  );

  const primaryImageIndex = images.findIndex((image) => image.isPrimary);
  const normalizedImages = images.map((image, index) => ({
    ...image,
    isPrimary: index === (primaryImageIndex === -1 ? 0 : primaryImageIndex),
    displayOrder: index + 1,
  }));

  return {
    ...draft,
    name: draft.name.trim(),
    slug: draft.slug.trim(),
    shortDescription: draft.shortDescription.trim(),
    description: draft.description.trim(),
    categoryId: draft.categoryId.trim(),
    priceLabel: draft.priceLabel.trim(),
    preparationNote: draft.preparationNote.trim(),
    visibleFrom: draft.visibleFrom.trim(),
    visibleTo: draft.visibleTo.trim(),
    customTags: draft.customTags.map((tag) => tag.trim()).filter(Boolean),
    optionGroups: draft.optionGroups
      .map((group, groupIndex) => ({
        ...group,
        name: group.name.trim(),
        description: group.description.trim(),
        displayOrder: Number.isFinite(group.displayOrder) ? group.displayOrder : groupIndex + 1,
        values: sortByOrder(
          group.values.map((value, valueIndex) => ({
            ...value,
            label: value.label.trim(),
            sku: value.sku.trim(),
            imageUrl: value.imageUrl.trim(),
            displayOrder: Number.isFinite(value.displayOrder) ? value.displayOrder : valueIndex + 1,
          })),
        ),
      }))
      .sort((left, right) => left.displayOrder - right.displayOrder),
    customizationFields: draft.customizationFields
      .map((field, fieldIndex) => ({
        ...field,
        label: field.label.trim(),
        description: field.description.trim(),
        placeholder: field.placeholder.trim(),
        displayOrder: Number.isFinite(field.displayOrder) ? field.displayOrder : fieldIndex + 1,
        allowedFiles: field.allowedFiles.map((fileType) => fileType.trim()).filter(Boolean),
        choiceLabels: field.choiceLabels.map((choice) => choice.trim()).filter(Boolean),
      }))
      .sort((left, right) => left.displayOrder - right.displayOrder),
    images: normalizedImages,
  };
}

export function calculateProductPricingSummary(draft: ProductDraft): ProductPricingSummary {
  const unitPrice = draft.basePrice ?? 0;
  const extraPrice =
    draft.optionGroups
      .flatMap((group) => group.values)
      .filter((value) => value.isDefault)
      .reduce((sum, value) => sum + value.extraPrice, 0) +
    draft.customizationFields.reduce((sum, field) => sum + (field.isRequired ? field.additionalPrice : 0), 0);

  return {
    unitPrice,
    extraPrice,
    totalPrice: unitPrice + extraPrice,
    priceLabel: getPriceLabel(draft),
    pricingTypeLabel: getPricingTypeLabel(draft.pricingType),
  };
}

export function getPrimaryImage(images: ProductImageDraft[]): ProductImageDraft | undefined {
  return images.find((image) => image.isPrimary) ?? images[0];
}

export function toProductListItem(draft: ProductDraft, categoryName: string, updatedAt = new Date().toISOString()): ProductListItem {
  const primaryImage = getPrimaryImage(draft.images);

  return {
    id: draft.id,
    name: draft.name,
    categoryName,
    status: draft.status,
    basePrice: draft.basePrice,
    priceLabel: getPriceLabel(draft),
    inventoryLabel: draft.madeToOrder ? 'مصنوع حسب الطلب' : `الكمية ${draft.quantity ?? 0}`,
    customizationLabel: draft.customizationFields.length > 0 || draft.hasVariants ? 'نعم' : 'لا',
    displayOrder: draft.displayOrder,
    isFeatured: draft.isFeatured,
    isVisible: draft.status === 'published',
    updatedAt,
    primaryImageUrl: primaryImage?.imageUrl ?? '',
  };
}

export function getPriceLabel(draft: ProductDraft): string {
  if (draft.pricingType === 'quote') {
    return draft.priceLabel.trim() || 'السعر عند الطلب';
  }

  if (draft.pricingType === 'startingFrom') {
    return draft.basePrice == null ? 'يبدأ من' : `يبدأ من ${formatCurrency(draft.basePrice)}`;
  }

  if (draft.pricingType === 'optionsBased') {
    return draft.basePrice == null ? 'حسب الخيارات' : `حسب الخيارات من ${formatCurrency(draft.basePrice)}`;
  }

  return draft.basePrice == null ? 'سعر ثابت' : formatCurrency(draft.basePrice);
}

export function getPricingTypeLabel(pricingType: ProductDraft['pricingType']): string {
  switch (pricingType) {
    case 'startingFrom':
      return 'السعر يبدأ من';
    case 'optionsBased':
      return 'السعر حسب الخيارات';
    case 'quote':
      return 'السعر عند الطلب';
    default:
      return 'سعر ثابت';
  }
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ar-EG', { maximumFractionDigits: 2 })} شيكل`;
}

function sortByOrder<T extends { displayOrder: number }>(items: T[]): T[] {
  return [...items].sort((left, right) => left.displayOrder - right.displayOrder);
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createGuid(): string {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  const randomValues = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(randomValues);
  } else {
    for (let index = 0; index < randomValues.length; index += 1) {
      randomValues[index] = Math.floor(Math.random() * 256);
    }
  }

  randomValues[6] = (randomValues[6] & 0x0f) | 0x40;
  randomValues[8] = (randomValues[8] & 0x3f) | 0x80;

  const hex = [...randomValues].map((value) => value.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
}
