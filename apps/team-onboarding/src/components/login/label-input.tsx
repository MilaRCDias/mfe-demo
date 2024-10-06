import React from 'react';
import type { FieldError, UseFormRegister } from 'react-hook-form';
import type { FormData } from './login';
import styles from '@/styles/login.module.css';

type LabelInputProps = {
  id: keyof FormData;
  label: string;
  type?: 'text' | 'password';
  register: ReturnType<UseFormRegister<FormData>>;
  error?: FieldError;
  placeholder?: string;
};

const LabelInput: React.FC<LabelInputProps> = ({
  id,
  label,
  type = 'text',
  register,
  error,
  placeholder,
}) => {
  return (
    <div className={styles['input-wrapper']}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={styles.input}
        aria-required='true'
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...register}
      />
      {error && <p className={styles['error-message']}>{error.message}</p>}
    </div>
  );
};

export default LabelInput;
