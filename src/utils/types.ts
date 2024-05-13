export type Category = string;

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images?: string[];
}

export type SelectedProduct = Pick<Product, | 'id'>

export type ChartData = {
  name: string;
  y: number
}

export interface PieChartCompProps {
  categories: Category[]
}