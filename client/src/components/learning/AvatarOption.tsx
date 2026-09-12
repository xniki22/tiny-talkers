import type { IAvatarOption } from "../../interfaces/IAvatarOption";

interface AvatarOptionProps {
  avatar: IAvatarOption;
  isSelected: boolean;
  onSelect: (avatarId: string) => void;
}

export function AvatarOption({
  avatar,
  isSelected,
  onSelect,
}: AvatarOptionProps) {
  return (
    <button
      type="button"
      className={
        isSelected
          ? "avatar-option avatar-option-selected"
          : "avatar-option"
      }
      onClick={() => onSelect(avatar.id)}
    >
      <span className="avatar-option-image">
        {avatar.imageUrl}
      </span>

      <span className="avatar-option-name">
        {avatar.name}
      </span>
    </button>
  );
}