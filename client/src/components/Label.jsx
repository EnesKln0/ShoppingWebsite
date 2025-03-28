export default function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium leading-6">
      {children}
    </label>
  );
}
