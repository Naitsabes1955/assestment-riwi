export function ErrorMessage(props: { readonly message: string }) {
  return (
    <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 shadow-sm">
      {props.message}
    </p>
  );
}
