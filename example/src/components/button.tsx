interface ButtonProps {
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({ disabled, children, onClick }: ButtonProps) => (
  <button
    onClick={onClick}
    className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    style={{
      opacity: disabled ? 0.5 : 1,
    }}
  >
    {children}
  </button>
);
