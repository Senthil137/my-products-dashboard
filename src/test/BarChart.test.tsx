import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ChartComponent from '../components/BarChart';
import axios from 'axios';

// Mocking styled-components
jest.mock('styled-components', () => ({
  __esModule: true,
  default: () => 'div',
}));

// Mocking Axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mocking Highcharts
jest.mock('highcharts-react-official', () => (props: any) => (
  <div>Highcharts Component with options: {JSON.stringify(props.options)}</div>
));

describe('ChartComponent', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it('renders and fetches categories', async () => {
    const categories = ['Electronics', 'Books', 'Clothing'];
    mockedAxios.get.mockResolvedValueOnce({ data: categories });
    render(<ChartComponent />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => {
      categories.forEach((category) => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });
  });

  it('handles category selection and fetches products', async () => {
    const categories = ['Electronics', 'Books', 'Clothing'];
    const products = [{ id: 1, title: 'Laptop', price: 1000 }];
    mockedAxios.get.mockResolvedValueOnce({ data: categories });
    mockedAxios.get.mockResolvedValueOnce({ data: { products } });
    render(<ChartComponent />);
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/category/i), {
        target: { value: 'Electronics' },
      });
    });
    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });
  });

  it('displays error message when category fetch fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    render(<ChartComponent />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});

