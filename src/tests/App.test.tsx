import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

test("render columns", () => {
  render(<App />);
  const backlogColumn = screen.getByText(/Backlog/i);
  const inProgressColumn = screen.getByText(/In Progress/i);
  const completedColumn = screen.getByText(/Completed/i);
  expect(backlogColumn).toBeInTheDocument();
  expect(inProgressColumn).toBeInTheDocument();
  expect(completedColumn).toBeInTheDocument();
});
