import { describe, expect, it } from 'vitest';
import { loginMessages, validateLoginForm } from './LoginForm';
import { buildRegisterRequest, validateRegisterForm, type RegisterFormState } from './RegisterForm';

const validRegisterState: RegisterFormState = {
  fullName: 'Layan Ahmad',
  phoneNumber: '0599999999',
  address: 'Ramallah',
  email: 'ik2907951@gmail.com',
  password: 'Password1',
  confirmPassword: 'Password1',
  acceptTerms: true,
};

describe('auth form validation', () => {
  it('requires login identifier and password', () => {
    expect(validateLoginForm({ identifier: '', password: '' })).toEqual([
      loginMessages.identifierRequired,
      loginMessages.passwordRequired,
    ]);
  });

  it('accepts valid login values', () => {
    expect(validateLoginForm({ identifier: '0599999999', password: 'Password1' })).toEqual([]);
  });

  it('requires complete register data and terms approval', () => {
    const invalidState: RegisterFormState = {
      fullName: '',
      phoneNumber: '059',
      address: '',
      email: 'bad-email',
      password: 'short',
      confirmPassword: 'different',
      acceptTerms: false,
    };

    expect(validateRegisterForm(invalidState)).toHaveLength(7);
  });

  it('accepts valid register data with email confirmation address', () => {
    expect(validateRegisterForm(validRegisterState)).toEqual([]);
  });

  it('builds a backend register request from the simplified UI fields', () => {
    expect(buildRegisterRequest(validRegisterState)).toEqual({
      firstName: 'Layan',
      lastName: 'Ahmad',
      userName: 'customer_0599999999',
      email: 'ik2907951@gmail.com',
      phoneNumber: '0599999999',
      address: 'Ramallah',
      password: 'Password1',
      confirmPassword: 'Password1',
    });
  });
});
