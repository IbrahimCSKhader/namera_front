type FormErrorProps = {
  errors: string[];
};

export function FormError({ errors }: FormErrorProps) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="form-error" role="alert">
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}
