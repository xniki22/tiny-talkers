interface SoundButtonProps {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
}

export function SoundButton({
  label = "Listen",
  onClick,
  disabled = false,
}: SoundButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="sound-button"
      aria-label={label}
    >
      🔊 {label}
    </button>
  );
}