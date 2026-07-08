type LoadingSpinnerProps = {
  label?: string;
};

export function LoadingSpinner({ label = 'جاري التحميل...' }: LoadingSpinnerProps) {
  return (
    <div className="loading-state" role="status">
      <span aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
