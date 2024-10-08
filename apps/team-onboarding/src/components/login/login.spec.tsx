import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './login';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Login Component', () => {
  test('renders the login form with username and password fields', () => {
    render(<Login />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('displays validation errors when form is submitted with empty fields', async () => {
    render(<Login />);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  test('displays minLength validation error for password', async () => {
    render(<Login />);

    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'short' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  test('submits the form with valid data', async () => {
    render(<Login />);

    fireEvent.input(screen.getByLabelText('Username'), {
      target: { value: 'Joan Doe' },
    });
    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    expect(console.log).toHaveBeenCalledWith('Login Data:', {
      username: 'Joan Doe',
      password: 'password123',
    });
  });
});
