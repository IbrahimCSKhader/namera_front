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
  basePrice: number;
  status: string;
  isFeatured: boolean;
  isCustomizable: boolean;
  minimumQuantity: number;
  maximumQuantity: number | null;
  preparationTimeInDays: number;
  category: ProductCategory;
  images: ProductImage[];
};
