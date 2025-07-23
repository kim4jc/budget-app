import { render, screen } from '@testing-library/react';
import LoginPage from './login.jsx';

describe('LoginPage', () => {
    it('renders the heading text', () => {
      render(<LoginPage />);
      const heading = screen.getByText('Login Page Test');
      expect(heading).toBeInTheDocument();
    });
  });