import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../components/App';
import axios from 'axios';
jest.mock('axios')

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Products Dashboard/i);
  expect(linkElement).toBeInTheDocument();
});
