import { apiClient } from '../../../../shared/services/api/apiClient';
import { type ApiResponse } from '../../../../shared/types/apiResponse';
import { type ProductCategory } from '../../types/productTypes';
import {
  type ProductCustomizationFieldDraft,
  type ProductDraft,
  type ProductImageDraft,
  type ProductListItem,
  type ProductOptionGroupDraft,
  type ProductOptionValueDraft,
} from '../types/productAdminTypes';
import { createEmptyProductDraft, createId, getPriceLabel } from '../utils/productDraft';

type AdminProductListItemResponse = {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  status: ProductDraft['status'];
  pricingType: ProductDraft['pricingType'];
  basePrice: number | null;
  priceLabel: string;
  inventoryLabel: string;
  isLowStock: boolean;
  hasCustomizations: boolean;
  isFeatured: boolean;
  isVisible: boolean;
  displayOrder: number;
  primaryImageUrl: string;
  createdAt: string;
  updatedAt: string | null;
};

type ProductDetailsResponse = Omit<ProductDraft, 'id' | 'images' | 'optionGroups' | 'customizationFields' | 'customTags' | 'allowMultiplePieces' | 'applyCustomizationsPerUnit' | 'minOrderQuantity' | 'maxOrderQuantity'> & {
  id: string;
  minimumQuantity: number;
  maximumQuantity: number | null;
  images: ProductImageDraft[];
  optionGroups: Array<Omit<ProductOptionGroupDraft, 'id' | 'values'> & { id: string; values: ProductOptionValueDraft[] }>;
  customizationFields: Array<Omit<ProductCustomizationFieldDraft, 'id' | 'choiceLabels'> & {
    id: string;
    choices: Array<{ label: string }>;
  }>;
};

type UploadedMediaResponse = {
  url: string;
  fileName: string;
  size: number;
};

export type ProductListFilters = {
  search?: string;
  categoryId?: string;
  status?: string;
  customized?: boolean;
  lowStockOnly?: boolean;
};

export async function getAdminProducts(filters: ProductListFilters = {}): Promise<ProductListItem[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });

  const response = await apiClient<ApiResponse<AdminProductListItemResponse[]>>(
    `/admin/products${params.size ? `?${params.toString()}` : ''}`,
  );

  return (response.data ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    categoryName: product.categoryName,
    status: product.status,
    basePrice: product.basePrice,
    priceLabel: product.priceLabel,
    inventoryLabel: product.inventoryLabel,
    customizationLabel: product.hasCustomizations ? 'نعم' : 'لا',
    displayOrder: product.displayOrder,
    isFeatured: product.isFeatured,
    isVisible: product.isVisible,
    updatedAt: product.updatedAt ?? product.createdAt,
    primaryImageUrl: product.primaryImageUrl,
  }));
}

export async function getAdminProduct(id: string): Promise<ProductDraft> {
  const response = await apiClient<ApiResponse<ProductDetailsResponse>>(`/admin/products/${id}`);
  return fromDetailsResponse(response.data);
}

export async function createAdminProduct(draft: ProductDraft): Promise<ProductDraft> {
  const response = await apiClient<ApiResponse<ProductDetailsResponse>>('/admin/products', {
    method: 'POST',
    body: toProductRequest(draft),
  });
  return fromDetailsResponse(response.data);
}

export async function updateAdminProduct(id: string, draft: ProductDraft): Promise<ProductDraft> {
  const response = await apiClient<ApiResponse<ProductDetailsResponse>>(`/admin/products/${id}`, {
    method: 'PUT',
    body: toProductRequest(draft),
  });
  return fromDetailsResponse(response.data);
}

export async function archiveAdminProduct(id: string): Promise<void> {
  await apiClient<ApiResponse<ProductDetailsResponse>>(`/admin/products/${id}/archive`, {
    method: 'PATCH',
  });
}

export async function publishAdminProduct(id: string, publish: boolean): Promise<void> {
  await apiClient<ApiResponse<ProductDetailsResponse>>(`/admin/products/${id}/publish?publish=${publish}`, {
    method: 'PATCH',
  });
}

export async function createAdminCategory(name: string): Promise<ProductCategory> {
  return createAdminCategoryWithImage(name);
}

export async function createAdminCategoryWithImage(
  name: string,
  imageUrl = '',
  categoryId = crypto.randomUUID(),
): Promise<ProductCategory> {
  const response = await apiClient<ApiResponse<ProductCategory>>('/admin/products/categories', {
    method: 'POST',
    body: {
      clientId: categoryId,
      name,
      imageUrl: imageUrl || undefined,
    },
  });

  if (!response.data) {
    throw new Error('لم يتم إنشاء التصنيف');
  }

  return response.data;
}

export async function uploadAdminProductImage(productId: string, file: File): Promise<UploadedMediaResponse> {
  const formData = new FormData();
  formData.set('productId', productId);
  formData.set('file', file);

  const response = await apiClient<ApiResponse<UploadedMediaResponse>>('/admin/products/uploads/product-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.data) {
    throw new Error('لم يتم رفع صورة المنتج');
  }

  return response.data;
}

export async function uploadAdminCategoryImage(categoryId: string, file: File): Promise<UploadedMediaResponse> {
  const formData = new FormData();
  formData.set('categoryId', categoryId);
  formData.set('file', file);

  const response = await apiClient<ApiResponse<UploadedMediaResponse>>('/admin/products/uploads/category-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.data) {
    throw new Error('لم يتم رفع صورة التصنيف');
  }

  return response.data;
}

function toProductRequest(draft: ProductDraft) {
  return {
    clientId: draft.id,
    name: draft.name,
    slug: draft.slug || undefined,
    shortDescription: draft.shortDescription,
    description: draft.description,
    categoryId: draft.categoryId,
    status: draft.status,
    pricingType: draft.pricingType,
    basePrice: draft.pricingType === 'quote' ? null : draft.basePrice,
    isPriceVisible: draft.isPriceVisible,
    priceLabel: draft.priceLabel || getPriceLabel(draft),
    currency: draft.currency,
    hasVariants: draft.hasVariants,
    images: draft.images.map((image) => ({
      imageUrl: image.imageUrl,
      altText: image.altText,
      isPrimary: image.isPrimary,
      displayOrder: image.displayOrder,
    })),
    optionGroups: draft.optionGroups.map((group) => ({
      name: group.name,
      description: group.description,
      isRequired: group.isRequired,
      isActive: group.isActive,
      displayOrder: group.displayOrder,
      values: group.values.map((value) => ({
        label: value.label,
        extraPrice: value.extraPrice,
        displayOrder: value.displayOrder,
        isActive: value.isActive,
        isDefault: value.isDefault,
        stockQuantity: value.stockQuantity,
        sku: value.sku,
        imageUrl: value.imageUrl,
      })),
    })),
    customizationFields: draft.customizationFields.map((field) => ({
      label: field.label,
      type: field.type,
      description: field.description,
      placeholder: field.placeholder,
      isRequired: field.isRequired,
      displayOrder: field.displayOrder,
      additionalPrice: field.additionalPrice,
      minLength: field.minLength,
      maxLength: field.maxLength,
      minValue: field.minValue,
      maxValue: field.maxValue,
      allowedFiles: field.allowedFiles,
      choices: field.choiceLabels.map((label, index) => ({
        label,
        additionalPrice: 0,
        displayOrder: index + 1,
        isActive: true,
      })),
      isActive: field.isActive,
    })),
    inventoryTrackingEnabled: draft.inventoryTrackingEnabled,
    quantity: draft.quantity,
    lowStockThreshold: draft.lowStockThreshold,
    madeToOrder: draft.madeToOrder,
    allowBackorder: draft.allowBackorder,
    minimumQuantity: draft.minOrderQuantity,
    maximumQuantity: draft.maxOrderQuantity,
    minPreparationDays: draft.minPreparationDays,
    maxPreparationDays: draft.maxPreparationDays,
    preparationUnit: draft.preparationUnit,
    preparationNote: draft.preparationNote,
    showOnHomepage: draft.showOnHomepage,
    isFeatured: draft.isFeatured,
    isNew: draft.isNew,
    showInSuggestions: draft.showInSuggestions,
    directAccessOnly: draft.directAccessOnly,
    allowRatings: draft.allowRatings,
    allowOrdering: draft.allowOrdering,
    displayOrder: draft.displayOrder,
    visibleFrom: draft.visibleFrom || null,
    visibleTo: draft.visibleTo || null,
  };
}

function fromDetailsResponse(details?: ProductDetailsResponse | null): ProductDraft {
  if (!details) {
    return createEmptyProductDraft();
  }

  return {
    ...createEmptyProductDraft(details.categoryId),
    ...details,
    id: details.id,
    minOrderQuantity: details.minimumQuantity,
    maxOrderQuantity: details.maximumQuantity,
    visibleFrom: details.visibleFrom ? details.visibleFrom.slice(0, 10) : '',
    visibleTo: details.visibleTo ? details.visibleTo.slice(0, 10) : '',
    images: details.images.map((image) => ({
      ...image,
      id: image.id || createId('image'),
      addedAt: image.addedAt ?? new Date().toISOString(),
    })),
    optionGroups: details.optionGroups.map((group) => ({
      ...group,
      id: group.id || createId('group'),
      values: group.values.map((value) => ({
        ...value,
        id: value.id || createId('value'),
      })),
    })),
    customizationFields: details.customizationFields.map((field) => ({
      ...field,
      id: field.id || createId('field'),
      choiceLabels: field.choices?.map((choice) => choice.label) ?? [],
    })),
    customTags: [],
    allowMultiplePieces: true,
    applyCustomizationsPerUnit: true,
  };
}
