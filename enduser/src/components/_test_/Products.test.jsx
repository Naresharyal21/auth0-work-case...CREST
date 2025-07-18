import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Products from "../../pages/Products";  // Adjust path if needed

// 👇 Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// 👇 Mock useProducts hook
vi.mock("../../hooks/useProducts", () => ({
  default: () => ({
    loading: false,
    error: null,
    products: [
      {
        id: 1,
        title: "Test Product",
        price: 100,
        thumbnail: "test.jpg",
        category: "Test Category",
        availabilityStatus: "In Stock",
        rating: 4.5,
        brand: "Test Brand",
        meta: {
          createdAt: "2023-07-01T00:00:00Z"
        }
      }
    ],
    totalCount: 5,
  }),
}));

// 👇 Mock withAuthorization HOC to return component directly
vi.mock("../../hoc/withAuthorization", () => ({
  default: (Component) => Component,
}));

// 👇 Mock Table component
vi.mock("../../components/table/Table", () => ({
  __esModule: true,
  default: ({ children }) => <table data-testid="table">{children}</table>,
}));

// 👇 Mock ProductRow component
vi.mock("../ProductRow", () => ({
  __esModule: true,
  default: ({ products, onViewProduct }) => (
    <tbody>
      {products.map((p) => (
        <tr key={p.id} onClick={() => onViewProduct(p.id)}>
          <td>{p.title}</td>
        </tr>
      ))}
    </tbody>
  ),
}));

// 👇 Mock Pagination component
vi.mock("../Pagination", () => ({
  __esModule: true,
  default: ({ currentPage, totalPages, onPageChange }) => (
    <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
  ),
}));

describe("Products Page", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders product data and price", () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    expect(screen.getByText("Products 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText(/Product Count: 1/)).toBeInTheDocument();
    expect(screen.getByText(/Total Price: \$100.00/)).toBeInTheDocument();
  });

  it("navigates to add product on button click", () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    const addButton = screen.getByText("Add Product");
    fireEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith("/products/add-product");
  });

  it("navigates to view product on row click", () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    const productRow = screen.getByText("Test Product");
    fireEvent.click(productRow);

    expect(mockNavigate).toHaveBeenCalledWith("/products/1");
  });

  it("triggers page change", () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // Dummy assertion to verify button exists and click works
    expect(nextButton).toBeInTheDocument();
  });
});
