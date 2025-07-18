import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import Sidebar from "../Sidebar";

const mockLogout = vi.fn();
const mockAuth0Logout = vi.fn();

vi.mock("../../hooks/useAuth", () => ({
    default: () => ({
        user: {
            name: "John Doe",
            email: "john@mail.com",
        },
        logout: mockLogout,
    })
}));

vi.mock("@auth0/auth0-react", () => ({
    useAuth0: () => ({
        logout: mockAuth0Logout,
    })
}));

describe("Sidebar Component", () => {
    it("renders the sidebar with correct links", () => {
        const { unmount } = render(
           <MemoryRouter initialEntries={['/']}>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText("ZARA")).toBeInTheDocument();
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Products")).toBeInTheDocument();
        expect(screen.getByText("Add Products")).toBeInTheDocument();
        expect(screen.getByText("Users")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();

        unmount();
    });

    it("calls logout and auth0Logout on logout click", () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Sidebar />
            </MemoryRouter>
        );

        const logoutButton = screen.getByText("Logout");
        logoutButton.click();

        expect(mockLogout).toHaveBeenCalled();
        expect(mockAuth0Logout).toHaveBeenCalledWith({ returnTo: window.location.origin });
    });
});