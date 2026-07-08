import { type HTMLInputTypeAttribute } from 'react';

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  dir?: 'rtl' | 'ltr';
};

export function Input({ label, name, value, onChange, type = 'text', placeholder, dir = 'rtl' }: InputProps) {
  return (
    <label className="field" htmlFor={name}>
      <span>{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        dir={dir}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
