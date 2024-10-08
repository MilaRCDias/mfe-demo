import React from 'react';
import { render, screen } from '@testing-library/react';
import LabelInput from './label-input';
import { FieldError } from 'react-hook-form';

const mockRegister = jest.fn((name) => ({
  name,
  onBlur: jest.fn(),
  onChange: jest.fn(),
  ref: jest.fn(),
}));

describe('LabelInput Component', () => {
  const mockError: FieldError = {
    type: 'required',
    message: 'This field is required',
  };

  it('renders the label and input', () => {
    render(
      <LabelInput id='username' label='Username' type='text' register={mockRegister('username')} />,
    );

    const input = screen.getByRole('textbox');

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders a password input type correctly', () => {
    render(
      <LabelInput
        id='password'
        label='Password'
        type='password'
        register={mockRegister('password')}
      />,
    );

    const input = screen.getByLabelText('Password');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders error message when there is an error', () => {
    render(
      <LabelInput
        id='username'
        label='Username'
        type='text'
        register={mockRegister('username')}
        error={mockError}
      />,
    );
    const errorMessage = screen.getByText('This field is required');

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('error-message');
  });
});
