import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PieChartComponent from '../components/PieChart';
import axios from "axios";
import { Product } from '../utils/types';

jest.mock('axios');

const mockCategories: string[] = ['Electronics', 'Books', 'Clothing'];
const mockResponse: { data: { products: Product[] } } = {
    data: {
        products: [
            {
                category: 'Electronics', id: 1,
                title: 'Product 1',
                description: 'Test Product 1',
                price: 200,
                discountPercentage: 5,
                rating: 3,
                stock: 12,
                brand: 'Apple',
                thumbnail: 'Product 1'
            },
            {
                category: 'Electronics', id: 2,
                title: 'Product 2',
                description: 'Test Product 2',
                price: 200,
                discountPercentage: 5,
                rating: 3,
                stock: 12,
                brand: 'Samsung',
                thumbnail: 'Product 2'
            },
            {
                category: 'Books', id: 3,
                title: 'Product 3',
                description: 'Test Product 3',
                price: 200,
                discountPercentage: 5,
                rating: 3,
                stock: 12,
                brand: 'Test Publications',
                thumbnail: 'Product 3'
            },
        ],
    },
};

describe('PieChartComponent', () => {
  it('renders the component', () => {
    render(<PieChartComponent categories={mockCategories} />);
    expect(screen.getByText('Product Categories')).toBeInTheDocument();
  });

  it('fetches products and displays category counts', async () => {
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);
    render(<PieChartComponent categories={mockCategories} />);

    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));
    render(<PieChartComponent categories={mockCategories} />);

    await waitFor(() => {
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
      expect(screen.queryByText('Books')).not.toBeInTheDocument();
      expect(screen.queryByText('Clothing')).not.toBeInTheDocument();
    });
  });
});
