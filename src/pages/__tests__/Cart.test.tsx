import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Cart from "../Cart";
import { CartProvider } from "@/hooks/use-cart";
import * as cartHook from "@/hooks/use-cart";
import { AuthProvider } from "@/hooks/use-auth";

const mockCartItems = [
  {
    id: "1",
    name: "Test Item 1",
    price: 10,
    quantity: 2,
    image: "test1.jpg",
  },
  {
    id: "2",
    name: "Test Item 2",
    price: 15,
    quantity: 1,
    image: "test2.jpg",
  },
];

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{component}</CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("Cart Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty cart state", () => {
    jest.spyOn(cartHook, "useCart").mockImplementation(() => ({
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn().mockReturnValue(0),
    }));

    renderWithProviders(<Cart />);

    expect(screen.getByTestId("empty-cart")).toBeInTheDocument();
    expect(screen.getByTestId("go-to-menu-button")).toBeInTheDocument();
  });

  it("renders cart items and summary", () => {
    const mockGetTotalPrice = jest.fn().mockReturnValue(35);
    jest.spyOn(cartHook, "useCart").mockImplementation(() => ({
      items: mockCartItems,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: mockGetTotalPrice,
    }));

    renderWithProviders(<Cart />);

    expect(screen.getByTestId("cart-items")).toBeInTheDocument();
    expect(screen.getByTestId("order-summary")).toBeInTheDocument();
    expect(screen.getByTestId("subtotal")).toHaveTextContent("35.00 ₺");
    expect(screen.getByTestId("total-price")).toHaveTextContent("45.00 ₺");
  });

  it("handles item quantity updates", () => {
    const mockUpdateQuantity = jest.fn();
    jest.spyOn(cartHook, "useCart").mockImplementation(() => ({
      items: mockCartItems,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: mockUpdateQuantity,
      clearCart: jest.fn(),
      getTotalPrice: jest.fn().mockReturnValue(35),
    }));

    renderWithProviders(<Cart />);

    // Increase quantity
    fireEvent.click(screen.getByTestId("increase-quantity-1"));
    expect(mockUpdateQuantity).toHaveBeenCalledWith("1", 3);

    // Decrease quantity
    fireEvent.click(screen.getByTestId("decrease-quantity-1"));
    expect(mockUpdateQuantity).toHaveBeenCalledWith("1", 1);
  });

  it("handles item removal", () => {
    const mockRemoveItem = jest.fn();
    jest.spyOn(cartHook, "useCart").mockImplementation(() => ({
      items: mockCartItems,
      addItem: jest.fn(),
      removeItem: mockRemoveItem,
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn().mockReturnValue(35),
    }));

    renderWithProviders(<Cart />);

    fireEvent.click(screen.getByTestId("remove-item-1"));
    expect(mockRemoveItem).toHaveBeenCalledWith("1");
  });

  it("handles cart clearing", () => {
    const mockClearCart = jest.fn();
    jest.spyOn(cartHook, "useCart").mockImplementation(() => ({
      items: mockCartItems,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: mockClearCart,
      getTotalPrice: jest.fn().mockReturnValue(35),
    }));

    renderWithProviders(<Cart />);

    fireEvent.click(screen.getByTestId("clear-cart-button"));
    expect(mockClearCart).toHaveBeenCalled();
  });

  it("displays correct item totals", () => {
    jest.spyOn(cartHook, "useCart").mockImplementation(() => ({
      items: mockCartItems,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn().mockReturnValue(35),
    }));

    renderWithProviders(<Cart />);

    expect(screen.getByTestId("item-total-1")).toHaveTextContent("20.00 ₺");
    expect(screen.getByTestId("item-total-2")).toHaveTextContent("15.00 ₺");
  });

  it("has working complete order button", () => {
    jest.spyOn(cartHook, "useCart").mockImplementation(() => ({
      items: mockCartItems,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn().mockReturnValue(35),
    }));

    renderWithProviders(<Cart />);

    const completeOrderLink = screen
      .getByTestId("complete-order-button")
      .closest("a");
    expect(completeOrderLink).toHaveAttribute("href", "/siparis");
  });
});
