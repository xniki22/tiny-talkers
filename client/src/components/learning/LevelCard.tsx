import type { ILevel } from "../../interfaces/ILevel";

interface LevelCardProps {
  level: ILevel;
  completedItems: number;
  isUnlocked: boolean;
  onClick: () => void;
}

export function LevelCard({
  level,
  completedItems,
  isUnlocked,
  onClick,
}: LevelCardProps) {
  const totalItems = level.items.length;

  return (
    <button
      type="button"
      className="level-card"
      onClick={onClick}
      disabled={!isUnlocked}
    >
      <div className="level-card-icon">
        {isUnlocked ? level.icon : "🔒"}
      </div>

      <div className="level-card-content">
        <span className="level-number">
          Level {level.levelNumber}
        </span>

        <h3>{level.title}</h3>

        <p>{level.description}</p>

        {isUnlocked ? (
          <span className="level-progress">
            {completedItems} / {totalItems} completed
          </span>
        ) : (
          <span className="level-locked">
            Complete the previous level to unlock
          </span>
        )}
      </div>
    </button>
  );
}