import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Menu from "../Menu";
import { CartProvider } from "@/hooks/use-cart";
import { AuthProvider } from "@/hooks/use-auth";
import * as menuAPI from "@/services/api";
import * as reviewAPI from "@/services/api";
import { toast } from "sonner";

// Mock the API calls
jest.mock("@/services/api", () => ({
  menuAPI: {
    getAllFoods: jest.fn(),
  },
  reviewAPI: {
    getReviewsByFoodId: jest.fn(),
  },
}));

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockMenuItems = [
  {
    food_id: "1",
    name: "Test Food 1",
    description: "Test Description 1",
    category: "Category 1",
    price_dine_in: "100.00",
    price_takeaway: "90.00",
    image: "test1.jpg",
    availability: true,
  },
  {
    food_id: "2",
    name: "Test Food 2",
    description: "Test Description 2",
    category: "Category 2",
    price_dine_in: "150.00",
    price_takeaway: "140.00",
    image: "test2.jpg",
    availability: true,
  },
];

const mockReviews = {
  average_rating: 4.5,
};

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{component}</CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("Menu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (menuAPI.menuAPI.getAllFoods as jest.Mock).mockResolvedValue(mockMenuItems);
    (reviewAPI.reviewAPI.getReviewsByFoodId as jest.Mock).mockResolvedValue(
      mockReviews
    );
  });

  it("renders loading state initially", () => {
    renderWithProviders(<Menu />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("loads and displays menu items", async () => {
    await act(async () => {
      renderWithProviders(<Menu />);
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Varsayılan olarak ilk kategori seçili, sadece bir ürün görünür
    expect(screen.getByText("Test Food 1")).toBeInTheDocument();
    expect(screen.queryByText("Test Food 2")).not.toBeInTheDocument();
  });

  it("displays categories and allows category switching", async () => {
    await act(async () => {
      renderWithProviders(<Menu />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Check if categories are displayed
    const categoryButtons = screen.getAllByRole("button", {
      name: /Category/i,
    });
    expect(categoryButtons).toHaveLength(2);

    // Switch category
    await act(async () => {
      fireEvent.click(categoryButtons[1]);
    });

    // Şimdi sadece ikinci ürün görünür
    expect(screen.getByText("Test Food 2")).toBeInTheDocument();
    expect(screen.queryByText("Test Food 1")).not.toBeInTheDocument();
  });

  it("displays food ratings", async () => {
    await act(async () => {
      renderWithProviders(<Menu />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Check if ratings are displayed
    const ratingElement = screen.getByTestId("food-rating");
    expect(ratingElement).toHaveTextContent("4.5");
  });

  it("handles adding items to cart", async () => {
    await act(async () => {
      renderWithProviders(<Menu />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Add item to cart
    const addToCartButton = screen.getByRole("button", { name: "Sepete Ekle" });
    await act(async () => {
      fireEvent.click(addToCartButton);
    });

    // Check if success toast is shown
    expect(toast.success).toHaveBeenCalledWith("Test Food 1 sepete eklendi");
  });

  it("displays correct prices for dine-in and takeaway", async () => {
    await act(async () => {
      renderWithProviders(<Menu />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Check dine-in price
    expect(screen.getByText("100.00 ₺")).toBeInTheDocument();

    // Check takeaway price
    expect(screen.getByText("Paket: 90.00 ₺")).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    (menuAPI.menuAPI.getAllFoods as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    await act(async () => {
      renderWithProviders(<Menu />);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Menü yüklenirken bir hata oluştu"
      );
    });
  });

  it("displays empty state when no items in category", async () => {
    (menuAPI.menuAPI.getAllFoods as jest.Mock).mockResolvedValue([
      {
        ...mockMenuItems[0],
        availability: false,
      },
    ]);

    await act(async () => {
      renderWithProviders(<Menu />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    expect(
      screen.getByText("Bu kategoride ürün bulunamadı.")
    ).toBeInTheDocument();
  });

  it("navigates to food detail page when clicking on food name", async () => {
    await act(async () => {
      renderWithProviders(<Menu />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    const foodLink = screen.getByText("Test Food 1").closest("a");
    expect(foodLink).toHaveAttribute("href", "/menu/1");
  });
});
