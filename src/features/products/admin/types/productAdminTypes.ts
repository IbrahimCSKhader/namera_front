export type ProductStatus = 'draft' | 'published' | 'hidden' | 'unavailable' | 'archived';

export type ProductPricingType = 'fixed' | 'startingFrom' | 'optionsBased' | 'quote';

export type ProductCustomizationFieldType =
  | 'shortText'
  | 'longText'
  | 'imageUpload'
  | 'singleSelect'
  | 'multiSelect'
  | 'checkbox'
  | 'date'
  | 'number';

export type ProductPreparationUnit = 'days' | 'weeks' | 'custom';

export type ProductImageDraft = {
  id: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
  addedAt: string;
  fileName?: string;
};

export type ProductOptionValueDraft = {
  id: string;
  label: string;
  extraPrice: number;
  displayOrder: number;
  isActive: boolean;
  isDefault: boolean;
  stockQuantity: number | null;
  sku: string;
  imageUrl: string;
};

export type ProductOptionGroupDraft = {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  displayOrder: number;
  isActive: boolean;
  values: ProductOptionValueDraft[];
};

export type ProductCustomizationFieldDraft = {
  id: string;
  label: string;
  type: ProductCustomizationFieldType;
  description: string;
  placeholder: string;
  isRequired: boolean;
  displayOrder: number;
  additionalPrice: number;
  minLength: number | null;
  maxLength: number | null;
  minValue: number | null;
  maxValue: number | null;
  allowedFiles: string[];
  choiceLabels: string[];
  isActive: boolean;
};

export type ProductDraft = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  status: ProductStatus;
  pricingType: ProductPricingType;
  basePrice: number | null;
  isPriceVisible: boolean;
  priceLabel: string;
  currency: 'ILS';
  hasVariants: boolean;
  optionGroups: ProductOptionGroupDraft[];
  customizationFields: ProductCustomizationFieldDraft[];
  images: ProductImageDraft[];
  inventoryTrackingEnabled: boolean;
  quantity: number | null;
  lowStockThreshold: number;
  madeToOrder: boolean;
  allowBackorder: boolean;
  minPreparationDays: number | null;
  maxPreparationDays: number | null;
  preparationUnit: ProductPreparationUnit;
  preparationNote: string;
  minOrderQuantity: number;
  maxOrderQuantity: number | null;
  allowMultiplePieces: boolean;
  applyCustomizationsPerUnit: boolean;
  showOnHomepage: boolean;
  isFeatured: boolean;
  isNew: boolean;
  showInSuggestions: boolean;
  directAccessOnly: boolean;
  allowRatings: boolean;
  allowOrdering: boolean;
  displayOrder: number;
  visibleFrom: string;
  visibleTo: string;
  customTags: string[];
};

export type ProductFieldErrors = Record<string, string[]>;

export type ProductValidationResult = {
  isValid: boolean;
  errors: ProductFieldErrors;
};

export type ProductPricingSummary = {
  unitPrice: number;
  extraPrice: number;
  totalPrice: number;
  priceLabel: string;
  pricingTypeLabel: string;
};

export type ProductListItem = {
  id: string;
  name: string;
  categoryName: string;
  status: ProductStatus;
  basePrice: number | null;
  priceLabel: string;
  inventoryLabel: string;
  customizationLabel: string;
  displayOrder: number;
  isFeatured: boolean;
  isVisible: boolean;
  updatedAt: string;
  primaryImageUrl: string;
};