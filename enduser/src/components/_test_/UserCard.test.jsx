import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import UserCard from "../UserCard";

describe("UserCard Component", () => {
    it("renders the user card with correct name and email", () => {
        const user = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            username: "johndoe",
            phone: "123-456-7890",
            address: {
                address: "123 Main St",
                city: "Anytown",
                state: "CA",
                postalCode: "12345"
            }
        };

        render(<UserCard user={user} />);

        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument();
        expect(screen.getByText(/Username: johndoe/i)).toBeInTheDocument();
        expect(screen.getByText(/Phone: 123-456-7890/i)).toBeInTheDocument();
        expect(screen.getByText(/Address: 123 Main St, Anytown, CA, 12345/i)).toBeInTheDocument();
    });
});