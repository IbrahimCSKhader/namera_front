import { describe, expect, it } from 'vitest';
import { loginMessages, validateLoginForm } from './LoginForm';
import { buildRegisterRequest, validateRegisterForm, type RegisterFormState } from './RegisterForm';

const validRegisterState: RegisterFormState = {
  fullName: 'Layan Ahmad',
  phoneNumber: '0599999999',
  address: 'Ramallah',
  email: '',
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

  it('builds a backend register request from the simplified UI fields', () => {
    expect(buildRegisterRequest(validRegisterState)).toEqual({
      firstName: 'Layan',
      lastName: 'Ahmad',
      userName: 'customer_0599999999',
      email: '',
      phoneNumber: '0599999999',
      address: 'Ramallah',
      password: 'Password1',
      confirmPassword: 'Password1',
    });
  });
});
