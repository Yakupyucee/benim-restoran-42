import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Register from "../Register";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import * as authHook from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "@/types";

// Mock useNavigate
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

// Mutable mock context for useAuth
let mockAuthContext: AuthContextType;

jest.mock("@/hooks/use-auth", () => {
  return {
    useAuth: () => mockAuthContext,
    AuthProvider: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{component}</CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("Register", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockAuthContext = {
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      register: jest.fn().mockResolvedValue(true),
      logout: jest.fn(),
      isLoading: false,
    };
  });

  it("renders the registration form", () => {
    renderWithProviders(<Register />);

    expect(
      screen.getByRole("heading", { name: "Kayıt Ol" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Ad Soyad")).toBeInTheDocument();
    expect(screen.getByLabelText("E-posta")).toBeInTheDocument();
    expect(screen.getByLabelText("Telefon Numarası")).toBeInTheDocument();
    expect(screen.getByLabelText("Şifre")).toBeInTheDocument();
    expect(screen.getByLabelText("Şifre (Tekrar)")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("validates password match", async () => {
    renderWithProviders(<Register />);

    const passwordInput = screen.getByLabelText("Şifre");
    const confirmPasswordInput = screen.getByLabelText("Şifre (Tekrar)");

    // Use long enough passwords that do not match
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password456" },
    });

    // Wait for state to update
    await waitFor(() => {
      expect(passwordInput).toHaveValue("password123");
      expect(confirmPasswordInput).toHaveValue("password456");
    });

    // Accept terms to enable validation
    fireEvent.click(screen.getByRole("checkbox"));

    // Submit form to trigger validation
    const submitButton = screen
      .getAllByRole("button", { name: "Kayıt Ol" })
      .find((btn) => btn.getAttribute("type") === "submit");
    fireEvent.click(submitButton!);

    // Debug: log the DOM after submit
    // eslint-disable-next-line no-console
    console.log(screen.debug());

    // Wait for the error message to appear
    const errorMessage = await screen.findByTestId("password-error");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.textContent).toContain("Şifreler eşleşmiyor");
  });

  it("validates password length", async () => {
    renderWithProviders(<Register />);

    const passwordInput = screen.getByLabelText("Şifre");
    const confirmPasswordInput = screen.getByLabelText("Şifre (Tekrar)");

    // Use matching passwords that are too short
    fireEvent.change(passwordInput, { target: { value: "12345" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "12345" } });

    // Wait for state to update
    await waitFor(() => {
      expect(passwordInput).toHaveValue("12345");
      expect(confirmPasswordInput).toHaveValue("12345");
    });

    // Accept terms to enable validation
    fireEvent.click(screen.getByRole("checkbox"));

    // Submit form to trigger validation
    const submitButton = screen
      .getAllByRole("button", { name: "Kayıt Ol" })
      .find((btn) => btn.getAttribute("type") === "submit");
    fireEvent.click(submitButton!);

    // Debug: log the DOM after submit
    // eslint-disable-next-line no-console
    console.log(screen.debug());

    // Wait for the error message to appear
    const errorMessage = await screen.findByTestId("password-error");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.textContent).toContain(
      "Şifre en az 6 karakter olmalıdır"
    );
  });

  it("submits the form with valid data", async () => {
    const mockRegister = jest.fn().mockResolvedValue(true);
    mockAuthContext.register = mockRegister;

    renderWithProviders(<Register />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Ad Soyad"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("E-posta"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Telefon Numarası"), {
      target: { value: "+90 555 123 4567" },
    });
    fireEvent.change(screen.getByLabelText("Şifre"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Şifre (Tekrar)"), {
      target: { value: "password123" },
    });

    // Accept terms
    fireEvent.click(screen.getByRole("checkbox"));

    // Submit form (select the submit button)
    const submitButton = screen
      .getAllByRole("button", { name: "Kayıt Ol" })
      .find((btn) => btn.getAttribute("type") === "submit");
    fireEvent.click(submitButton!);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "Test User",
        "test@example.com",
        "+90 555 123 4567",
        "password123",
        "password123"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/giris");
    });
  });

  it("disables submit button when terms are not accepted", () => {
    renderWithProviders(<Register />);

    // Select the submit button
    const submitButton = screen
      .getAllByRole("button", { name: "Kayıt Ol" })
      .find((btn) => btn.getAttribute("type") === "submit");
    expect(submitButton).toBeDisabled();

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Ad Soyad"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("E-posta"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Telefon Numarası"), {
      target: { value: "+90 555 123 4567" },
    });
    fireEvent.change(screen.getByLabelText("Şifre"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Şifre (Tekrar)"), {
      target: { value: "password123" },
    });

    // Button should still be disabled without terms acceptance
    expect(submitButton).toBeDisabled();

    // Accept terms
    fireEvent.click(screen.getByRole("checkbox"));

    // Button should now be enabled
    expect(submitButton).not.toBeDisabled();
  });

  it("shows loading state during submission", async () => {
    const mockRegister = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
    mockAuthContext.register = mockRegister;

    renderWithProviders(<Register />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Ad Soyad"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("E-posta"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Telefon Numarası"), {
      target: { value: "+90 555 123 4567" },
    });
    fireEvent.change(screen.getByLabelText("Şifre"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Şifre (Tekrar)"), {
      target: { value: "password123" },
    });

    // Accept terms
    fireEvent.click(screen.getByRole("checkbox"));

    // Submit form (select the submit button)
    const submitButton = screen
      .getAllByRole("button", { name: "Kayıt Ol" })
      .find((btn) => btn.getAttribute("type") === "submit");
    fireEvent.click(submitButton!);

    // Check loading state
    expect(screen.getByText("Kayıt yapılıyor...")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
  });
});
