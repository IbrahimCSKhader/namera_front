import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import * as productApi from '../services/productApi';
import { type Product, type ProductCategory } from '../types/productTypes';
import { BRAND } from '../../../shared/constants/brand';

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productApi.getProducts(),
          productApi.getCategories(),
        ]);

        setProducts(productsResponse.data ?? []);
        setCategories(categoriesResponse.data ?? []);
      } catch {
        setProducts([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    }

    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = (searchParams.get('search') ?? '').trim().toLowerCase();
    const categoryId = searchParams.get('category') ?? '';

    return products.filter((product) => {
      const matchesSearch = query
        ? [product.name, product.shortDescription, product.category.name].some((value) => value.toLowerCase().includes(query))
        : true;
      const matchesCategory = categoryId ? product.category.id === categoryId : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchParams]);

  const activeCategory = categories.find((category) => category.id === searchParams.get('category'));

  return (
    <main className="shop-page">
      <section className="page-heading shop-heading">
        <p className="eyebrow">{BRAND.name}</p>
        <h1>{activeCategory ? activeCategory.name : 'المنتجات'}</h1>
        <p>تظهر هنا المنتجات المخزنة في قاعدة البيانات فقط.</p>
      </section>

      {isLoading ? (
        <div className="loading-state"><span /> جار تحميل المنتجات...</div>
      ) : filteredProducts.length > 0 ? (
        <div className="shop-product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="empty-state">لا توجد منتجات حاليا.</p>
      )}
    </main>
  );
}
