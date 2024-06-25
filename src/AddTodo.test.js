import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




test('test that App component doesn\'t render duplicate Task', () => {
  render(<App />);
  // Add a task
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDueDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: 'HistoryTest' } });
  fireEvent.change(inputDueDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  // Try to add the same task again
  fireEvent.change(inputTask, { target: { value: 'HistoryTest' } });
  fireEvent.change(inputDueDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  // Check if only one instance of 'History Test' exists
  const duplicateTask = screen.queryByText('HistoryTest');
  expect(duplicateTask).toBeInTheDocument();
});

test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  // Add a task without a task name
  const inputDueDate = screen.getByLabelText(/Due Date/i);
  const addButton = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputDueDate, { target: { value: '2024-06-30' } });
  fireEvent.click(addButton);

  // Check if the task without a task name is not added
  const taskWithoutName = screen.queryByText(/2024-06-30/i); // Checking based on due date appearance
  expect(taskWithoutName).not.toBeInTheDocument();
});

test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  // Add a task without a due date
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const addButton = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputTask, { target: { value: 'Math Test' } });
  fireEvent.click(addButton);

  // Check if the task without a due date is not added
  const taskWithoutDueDate = screen.queryByText(/Math Test/i);
  expect(taskWithoutDueDate).not.toBeInTheDocument();
});

test('test that App component can be deleted thru checkbox', async () => {
  render(<App />);
  // Add a task
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDueDate = screen.getByLabelText(/Due Date/i);
  const addButton = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputTask, { target: { value: 'History Test' } });
  fireEvent.change(inputDueDate, { target: { value: '2024-06-30' } });
  fireEvent.click(addButton);

  await screen.findByTestId("History Test");

  // Delete the task
  const deleteCheckbox = screen.getByTestId('checkbox');
  fireEvent.click(deleteCheckbox);

  // Check if the task is deleted
  const deletedTask = screen.queryByText(/History Test/i);
  expect(deletedTask).not.toBeInTheDocument();
});

test('test that App component renders different colors for past due events', () => {
  render(<App />);
  // Add a task with past due date
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDueDate = screen.getByLabelText(/Due Date/i);
  const addButton = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputTask, { target: { value: 'History Test' } });
  fireEvent.change(inputDueDate, { target: { value: '2023-06-30' } });
  fireEvent.click(addButton);

  // Check if the card for past due task has a different background color
  const pastDueTaskCard = screen.getByTestId(/History Test/i);
  const pastDueTaskColor = window.getComputedStyle(pastDueTaskCard).backgroundColor;
  expect(pastDueTaskColor).not.toBe("white");
});


