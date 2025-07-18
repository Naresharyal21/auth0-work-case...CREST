import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Users from "../../pages/Users";

// 👇 Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  ...vi.importActual("react-router"),
  useNavigate: () => mockNavigate,
}));

// 👇 Mock useUsers
vi.mock("../../hooks/useUsers", () => ({
  default: () => ({
    loading: false,
    users: [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
      },
    ],
    totalUsers: 2,
  }),
}));

// 👇 Mock useSortUsers
vi.mock("../../hooks/useSortUsers", () => ({
  default: () => ({
    user: [
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
      },
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
    ],
  }),
}));

// 👇 Mock UserCard
vi.mock("../../components/UserCard", () => ({
  __esModule: true,
  default: ({ user }) => (
    <div data-testid="user-card">
      {user.firstName} {user.lastName} - {user.email}
    </div>
  ),
}));

// 👇 Mock Pagination
vi.mock("../../pages/Pagination", () => ({
  __esModule: true,
  default: ({ currentPage, totalPages, onPageChange }) => (
    <div className="pagination-container">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        Prev
      </button>
      <button>{currentPage}</button>
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next
      </button>
    </div>
  ),
}));

// 👇 Mock withAuthorization
vi.mock("../../hoc/withAuthorization", () => ({
  default: (Component) => Component,
}));

describe("Users Page", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders users and pagination button", () => {
    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    const userCards = screen.getAllByTestId("user-card");
    expect(userCards.length).toBe(2);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("navigates to user details on user card click", () => {
    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    const firstUserCard = screen.getByText(/John Doe/i);
    fireEvent.click(firstUserCard);
    expect(mockNavigate).toHaveBeenCalledWith("/users/1");
  });

  it("toggles sorting when sort button is clicked", () => {
    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    const sortButton = screen.getByRole("button", { name: /sort users/i });
    fireEvent.click(sortButton);

    const sortedUser = screen.getByText(/Jane Smith/i);
    expect(sortedUser).toBeInTheDocument();
  });

  it("handles pagination next button click", () => {
    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);
  });
});
