import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard', () => {
  render(<App />);
  expect(screen.getByText(/xpensive/i)).toBeInTheDocument();
});
