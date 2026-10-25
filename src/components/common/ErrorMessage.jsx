export default function ErrorMessage({ children }) {
  if (!children) return null;
  return <div className="form-error" role="alert">{children}</div>;
}
