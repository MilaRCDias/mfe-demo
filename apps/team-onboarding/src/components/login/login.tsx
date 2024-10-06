import React from 'react';
import LabelInput from './label-input';
import styles from '@/styles/login.module.css';
import { useForm } from 'react-hook-form';

export type FormData = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Login Data:', data);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2>Login</h2>

        <LabelInput
          id='username'
          label='Username'
          type='text'
          placeholder='Joan Doe'
          register={register('username', {
            required: 'Username is required',
          })}
          error={errors.username}
        />

        <LabelInput
          id='password'
          label='Password'
          type='password'
          register={register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
          error={errors.password}
        />

        <button type='submit' className={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
