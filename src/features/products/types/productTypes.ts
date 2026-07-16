export type ProductImage = {
  id: string;
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  displayOrder: number;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  basePrice: number | null;
  pricingType: 'fixed' | 'startingFrom' | 'optionsBased' | 'quote';
  isPriceVisible: boolean;
  priceLabel: string;
  currency: string;
  status: string;
  isFeatured: boolean;
  isNew: boolean;
  isCustomizable: boolean;
  hasVariants: boolean;
  madeToOrder: boolean;
  allowOrdering: boolean;
  minimumQuantity: number;
  maximumQuantity: number | null;
  preparationTimeInDays: number;
  preparationNote: string;
  category: ProductCategory;
  images: ProductImage[];
  optionGroups: Array<{
    id: string;
    name: string;
    isRequired: boolean;
    values: Array<{ id: string; label: string; extraPrice: number; isDefault: boolean }>;
  }>;
  customizationFields: Array<{
    id: string;
    label: string;
    type: string;
    isRequired: boolean;
    additionalPrice: number;
    choices: Array<{ id: string; label: string; additionalPrice: number }>;
  }>;
};
