import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter, useLocation } from "react-router-dom";
import MainNavigation from "../MainNavigation";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import * as authHook from "@/hooks/use-auth";
import * as cartHook from "@/hooks/use-cart";
import { User, AuthContextType, CartItem } from "@/types";

// Mock useLocation for all tests
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useLocation: jest.fn(() => ({ pathname: "/" })),
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

describe("MainNavigation", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders the logo", () => {
    jest.spyOn(authHook, "useAuth").mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    });
    jest.spyOn(cartHook, "useCart").mockReturnValue({
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn(),
    });
    renderWithProviders(<MainNavigation />);
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("R")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    jest.spyOn(authHook, "useAuth").mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    });
    jest.spyOn(cartHook, "useCart").mockReturnValue({
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn(),
    });
    renderWithProviders(<MainNavigation />);
    expect(screen.getByText("Ana Sayfa")).toBeInTheDocument();
    expect(screen.getByText("Menü")).toBeInTheDocument();
  });

  it("renders login and register buttons when not authenticated", () => {
    jest.spyOn(authHook, "useAuth").mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    });
    jest.spyOn(cartHook, "useCart").mockReturnValue({
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn(),
    });
    renderWithProviders(<MainNavigation />);
    expect(screen.getByText("Giriş Yap")).toBeInTheDocument();
    expect(screen.getByText("Kayıt Ol")).toBeInTheDocument();
  });

  it("renders user profile and logout when authenticated", () => {
    const mockUser: User = {
      user_id: "1",
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      role: "user",
      token: "mock-token",
    };
    const mockAuthContext: AuthContextType = {
      isAuthenticated: true,
      user: mockUser,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    };
    jest.spyOn(authHook, "useAuth").mockReturnValue(mockAuthContext);
    jest.spyOn(cartHook, "useCart").mockReturnValue({
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn(),
    });
    renderWithProviders(<MainNavigation />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Çıkış")).toBeInTheDocument();
  });

  it("renders admin panel link for admin users", () => {
    const mockAdmin: User = {
      user_id: "2",
      name: "Admin User",
      email: "admin@example.com",
      phone: "0987654321",
      role: "admin",
      token: "mock-token",
    };
    const mockAuthContext: AuthContextType = {
      isAuthenticated: true,
      user: mockAdmin,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    };
    jest.spyOn(authHook, "useAuth").mockReturnValue(mockAuthContext);
    jest.spyOn(cartHook, "useCart").mockReturnValue({
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn(),
    });
    renderWithProviders(<MainNavigation />);
    expect(screen.getByText("Admin Paneli")).toBeInTheDocument();
  });

  it("shows cart items count when there are items in cart", () => {
    const mockCartItems: CartItem[] = [
      { id: "1", name: "Item 1", price: 10, quantity: 1, image: "item1.jpg" },
      { id: "2", name: "Item 2", price: 20, quantity: 1, image: "item2.jpg" },
    ];
    jest.spyOn(authHook, "useAuth").mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    });
    jest.spyOn(cartHook, "useCart").mockReturnValue({
      items: mockCartItems,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn(),
    });
    renderWithProviders(<MainNavigation />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("handles logout when clicking the logout button", async () => {
    const mockLogout = jest.fn();
    const mockUser: User = {
      user_id: "1",
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      role: "user",
      token: "mock-token",
    };
    const mockAuthContext: AuthContextType = {
      isAuthenticated: true,
      user: mockUser,
      login: jest.fn(),
      register: jest.fn(),
      logout: mockLogout,
      isLoading: false,
    };
    jest.spyOn(authHook, "useAuth").mockReturnValue(mockAuthContext);
    jest.spyOn(cartHook, "useCart").mockReturnValue({
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn(),
    });
    renderWithProviders(<MainNavigation />);
    const logoutButton = screen.getByText("Çıkış");
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });

  it("shows active state for current route", () => {
    jest.spyOn(authHook, "useAuth").mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    });
    jest.spyOn(cartHook, "useCart").mockReturnValue({
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn(),
    });
    // Mock useLocation to return /menu
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/menu" });
    renderWithProviders(<MainNavigation />);
    const menuLink = screen.getByText("Menü").closest("a");
    expect(menuLink).toHaveClass("text-restaurant-700");
    expect(menuLink).toHaveClass("border-b-2");
    expect(menuLink).toHaveClass("border-restaurant-700");
  });

  it("shows mobile-friendly navigation elements", () => {
    jest.spyOn(authHook, "useAuth").mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    });
    jest.spyOn(cartHook, "useCart").mockReturnValue({
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn(),
    });
    renderWithProviders(<MainNavigation />);
    // Check if cart icon is visible
    expect(screen.getByRole("link", { name: "Sepet" })).toBeInTheDocument();
    // Check if login button is visible
    expect(screen.getByText("Giriş Yap")).toBeInTheDocument();
    // Check if register button is hidden on mobile
    const registerButton = screen.getByText("Kayıt Ol");
    expect(registerButton.closest("a")).toHaveClass("hidden md:inline-block");
  });

  it("shows user name in profile link when authenticated", () => {
    const mockUser: User = {
      user_id: "1",
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      role: "user",
      token: "mock-token",
    };
    const mockAuthContext: AuthContextType = {
      isAuthenticated: true,
      user: mockUser,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    };
    jest.spyOn(authHook, "useAuth").mockReturnValue(mockAuthContext);
    jest.spyOn(cartHook, "useCart").mockReturnValue({
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn(),
    });
    renderWithProviders(<MainNavigation />);
    const profileLink = screen.getByText("Test User");
    expect(profileLink).toBeInTheDocument();
    expect(profileLink.closest("a")).toHaveAttribute("href", "/profil");
  });
});
