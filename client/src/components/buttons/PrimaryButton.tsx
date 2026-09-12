interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}

export function PrimaryButton({
  label,
  onClick,
  disabled = false,
  type = "button",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="primary-button"
    >
      {label}
    </button>
  );
}