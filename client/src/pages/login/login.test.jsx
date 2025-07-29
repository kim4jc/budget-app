import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './login.jsx';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';


//replace useauth with a mock version that returns mockLogin and mockRegister functions instead of the real ones
vi.mock('../../context/authcontext/authcontext.jsx', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
  }),
}));

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    //override useNaviagate with our mockNavigate
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLogin = vi.fn();
const mockRegister = vi.fn();

describe('LoginPage', () => {
  //before each test reset mock fn histories so previous tests dont interfere 
  beforeEach(() => {
    mockLogin.mockReset();
    mockRegister.mockReset();
    mockNavigate.mockReset();
  });

  test('renders inputs and buttons', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    //expect correct buttons and placeholdertext
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('calls login on login button click and navigates on success', async () => {
    //simulate successful login
    mockLogin.mockResolvedValue(true);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    //simulate login button w/ username = testuser1 and password = pwd1
    fireEvent.change(screen.getByPlaceholderText(/enter username/i), { target: { value: 'testuser1' } });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: 'pwd1' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    //wait for async fn to finish and expect mocklogin and mocknavigate to have been called with / (homepage)
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser1', 'pwd1');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('calls register on register button click and auto logs in on success', async () => {
    //simulate successful registration and subsequent login
    mockRegister.mockResolvedValue(true);
    mockLogin.mockResolvedValue(true);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    //simulate registration button w/ username = testuser1 and password = pwd1
    fireEvent.change(screen.getByPlaceholderText(/enter username/i), { target: { value: 'testuser2' } });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: 'pwd2' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    //wait for async fn to finish and expect mockregister, mocklogin, and mocknavgate called with / (homepage)
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('testuser2', 'pwd2');
      expect(mockLogin).toHaveBeenCalledWith('testuser2', 'pwd2');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('shows alert on login failure', async () => {
    //simulate failed login
    mockLogin.mockResolvedValue(false);
    window.alert = vi.fn();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    //simulate login button for failure
    fireEvent.change(screen.getByPlaceholderText(/enter username/i), { target: { value: 'faileduser1' } });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: 'failedpwd1' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    //expect alert for login failure
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Login failed');
    });
  });

  test('shows alert on registration failure', async () => {
    //simulate failed registration
    mockRegister.mockResolvedValue(false);
    window.alert = vi.fn();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    //simulate register button for failure
    fireEvent.change(screen.getByPlaceholderText(/enter username/i), { target: { value: 'faileduser2' } });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: 'failedpwd2' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    //expect alert for failed registration
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Registration failed');
    });
  });
});
