import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";
import { AuthProvider } from "@/hooks/use-auth";
import * as authHook from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{component}</CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form", () => {
    renderWithProviders(<Login />);

    expect(screen.getByTestId("login-container")).toBeInTheDocument();
    expect(screen.getByTestId("login-title")).toHaveTextContent("Giriş Yap");
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("login-submit-button")).toBeInTheDocument();
  });

  it("handles form submission successfully", async () => {
    const mockLogin = jest.fn().mockResolvedValue(true);
    jest.spyOn(authHook, "useAuth").mockImplementation(() => ({
      isAuthenticated: false,
      user: null,
      login: mockLogin,
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    }));

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("login-submit-button"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("handles form submission failure", async () => {
    const mockLogin = jest.fn().mockResolvedValue(false);
    jest.spyOn(authHook, "useAuth").mockImplementation(() => ({
      isAuthenticated: false,
      user: null,
      login: mockLogin,
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    }));

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByTestId("login-submit-button"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        "test@example.com",
        "wrongpassword"
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("shows loading state during submission", async () => {
    const mockLogin = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(true), 100))
      );
    jest.spyOn(authHook, "useAuth").mockImplementation(() => ({
      isAuthenticated: false,
      user: null,
      login: mockLogin,
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    }));

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("login-submit-button"));

    expect(screen.getByTestId("login-submit-button")).toHaveTextContent(
      "Giriş yapılıyor..."
    );
    expect(screen.getByTestId("login-submit-button")).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByTestId("login-submit-button")).toHaveTextContent(
        "Giriş Yap"
      );
      expect(screen.getByTestId("login-submit-button")).not.toBeDisabled();
    });
  });

  it("has working links to register and password reset", () => {
    renderWithProviders(<Login />);

    const registerLink = screen.getByTestId("register-link");
    const forgotPasswordLink = screen.getByTestId("forgot-password-link");

    expect(registerLink).toHaveAttribute("href", "/kayit");
    expect(forgotPasswordLink).toHaveAttribute("href", "/sifre-sifirlama");
  });
});
