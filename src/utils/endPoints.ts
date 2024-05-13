export const getCategories: string = 'https://dummyjson.com/products/categories';
export const getProducts: string = 'https://dummyjson.com/products/';
export const getSelectedCategoryProduts = (selectedCategory: string): string=> `https://dummyjson.com/products/category/${selectedCategory}`;