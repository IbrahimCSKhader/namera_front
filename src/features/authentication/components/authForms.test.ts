import { describe, expect, it } from 'vitest';
import { validateLoginForm } from './LoginForm';
import { buildRegisterRequest, validateRegisterForm, type RegisterFormState } from './RegisterForm';

const validRegisterState: RegisterFormState = {
  fullName: 'ليان أحمد',
  phoneNumber: '0599999999',
  address: 'رام الله',
  email: '',
  password: 'Password1',
  confirmPassword: 'Password1',
  acceptTerms: true,
};

describe('auth form validation', () => {
  it('requires login identifier and password', () => {
    expect(validateLoginForm({ identifier: '', password: '' })).toEqual([
      'رقم الهاتف أو البريد الإلكتروني أو اسم المستخدم مطلوب',
      'كلمة المرور مطلوبة',
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

    expect(validateRegisterForm(invalidState)).toEqual([
      'الاسم الكامل مطلوب',
      'رقم الهاتف مطلوب ويجب أن يحتوي 8 أرقام على الأقل',
      'البريد الإلكتروني غير صالح',
      'العنوان مطلوب',
      'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
      'كلمة المرور وتأكيدها غير متطابقين',
      'يجب الموافقة على الشروط والأحكام',
    ]);
  });

  it('builds a backend register request from the simplified UI fields', () => {
    expect(buildRegisterRequest(validRegisterState)).toEqual({
      firstName: 'ليان',
      lastName: 'أحمد',
      userName: 'customer_0599999999',
      email: '',
      phoneNumber: '0599999999',
      address: 'رام الله',
      password: 'Password1',
      confirmPassword: 'Password1',
    });
  });
});
