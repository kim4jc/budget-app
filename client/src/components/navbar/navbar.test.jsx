import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../context/authcontext/authcontext.jsx";
import Navbar from "./navbar.jsx";

test("shows welcome message and logout when logged in and shows login button when logged out", () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </AuthProvider>
  );

  //we check to see if welcome, username + logout are in doc
  expect(screen.getByText(/Welcome, testUsername/i)).toBeInTheDocument();
  expect(screen.getByText(/Logout/i)).toBeInTheDocument();


  //we press logout button then check to see if logout is NOT in doc but login is in doc
  fireEvent.click(screen.getByText(/Logout/i));
  expect(screen.queryByText(/Logout/i)).toBeNull();
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});
