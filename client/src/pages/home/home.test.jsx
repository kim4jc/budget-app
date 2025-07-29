import { render, screen } from '@testing-library/react';
import HomePage from './home.jsx';

describe('HomePage', () => {
    test('renders the heading text', () => {
      render(<HomePage />);
      const heading = screen.getByText('Home Page Test');
      expect(heading).toBeInTheDocument();
    });
  });