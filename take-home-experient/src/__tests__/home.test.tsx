// import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../pages/home";

import userEvent from "@testing-library/user-event";

beforeEach(() => {
  render(<Home />);
});

test("loads and displays greeting", async () => {
  const AutoCompleteLabel = screen.getByTestId("auto-complete-label");
  expect(AutoCompleteLabel).toBeInTheDocument();
  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});

test("input field updates on user input", async () => {
  const inputElement = screen.getByRole("combobox", { name: /name/i });

  // Type users name and expect results to appear
  await userEvent.type(inputElement, "Schulist");

  expect(inputElement).toHaveValue("Schulist");
  const dropdownItem = await screen.findByRole("option");
  fireEvent.click(dropdownItem);

  expect(inputElement).toHaveValue("Schulist, Dennis (Mrs.)");

  const UserDetailName = await screen.getByTestId("detail-name");
  expect(UserDetailName).toBeInTheDocument();
  expect(UserDetailName).toHaveTextContent("Schulist, Dennis (Mrs.)");

  fireEvent.mouseEnter(dropdownItem);

  // find clear button and clear AutoComplete
  const clearButton = screen.getByTitle("Clear");
  await userEvent.click(clearButton);

  expect(inputElement).toHaveValue("");
});

test("display No Optoion", async () => {
  const inputElement = screen.getByRole("combobox", { name: /name/i });

  // Type a name that does not exist
  await userEvent.type(inputElement, "NonExistentUser");

  expect(inputElement).toHaveValue("NonExistentUser");

  // Check if "No options" message is displayed
  const noOptionsMessage = screen.getByText("No options");
  expect(noOptionsMessage).toBeInTheDocument();
});
