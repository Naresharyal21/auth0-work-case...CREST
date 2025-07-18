import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../Button";

describe("Button component", () => {
  it('increments the number when "Cancel3" is clicked', () => {
    render(<Button />);

    const cancel3Button = screen.getByText("Cancel3");
    const counterText = () => screen.getByText(/Clicked \d+ times/i);

    expect(counterText()).toHaveTextContent("Clicked 0 times");

    fireEvent.click(cancel3Button);
    expect(counterText()).toHaveTextContent("Clicked 1 times");

    fireEvent.click(cancel3Button);
    expect(counterText()).toHaveTextContent("Clicked 2 times");
  });
});
