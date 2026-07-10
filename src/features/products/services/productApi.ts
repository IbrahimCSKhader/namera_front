import { apiClient } from '../../../shared/services/api/apiClient';
import { type ApiResponse } from '../../../shared/types/apiResponse';
import { type Product, type ProductCategory } from '../types/productTypes';

export function getProducts(): Promise<ApiResponse<Product[]>> {
  return apiClient<ApiResponse<Product[]>>('/products', {
    requiresAuth: false,
  });
}

export function getCategories(): Promise<ApiResponse<ProductCategory[]>> {
  return apiClient<ApiResponse<ProductCategory[]>>('/products/categories', {
    requiresAuth: false,
  });
}
