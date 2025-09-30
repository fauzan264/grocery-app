interface ButtonProps {
  type?: "submit" | "button" | "reset";
  name: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export default function Button({
  type,
  name,
  disabled = false,
  loading = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="btn border-0 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 transition ease-in-out duration-300 text-slate-100 w-full my-5 focus:outline-none"
    >
      {name}
    </button>
  );
}
