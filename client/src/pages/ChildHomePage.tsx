import { LevelCard } from "../components/learning/LevelCard";
import { levels } from "../data/levels";

interface ChildHomePageProps {
  childName: string;

  completedLevelIds: string[];

  completedItemCounts: Record<
    string,
    number
  >;

  onSelectLevel: (
    levelId: string
  ) => void;

  onSwitchProfile: () => void;

  onLogout: () => Promise<void>;
}

export function ChildHomePage({
  childName,
  completedLevelIds,
  completedItemCounts,
  onSelectLevel,
  onSwitchProfile,
  onLogout,
}: ChildHomePageProps) {
  return (
    <main className="learning-home">
      <section className="learning-home-header">
        <div className="learning-home-top">
          <div>
            <p className="learning-eyebrow">
              Tiny Talkers
            </p>

            <h1>
              Let's learn together!
            </h1>

            <p>
              Learning with{" "}
              <strong>{childName}</strong>
            </p>
          </div>

          <div className="learning-home-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onSwitchProfile}
            >
              Switch Profile
            </button>

            <button
              type="button"
              className="text-button"
              onClick={() => {
                void onLogout();
              }}
            >
              Log Out
            </button>
          </div>
        </div>

        <p className="learning-home-description">
          Choose a level and practice new words,
          phrases, and sentences.
        </p>
      </section>

      <section className="level-list">
        {levels.map((level, index) => {
          const previousLevel =
            index > 0
              ? levels[index - 1]
              : null;

          const isUnlocked =
            index === 0 ||
            (
              previousLevel !== null &&
              completedLevelIds.includes(
                previousLevel.levelId
              )
            );

          const completedItems =
            completedItemCounts[
              level.levelId
            ] ?? 0;

          return (
            <LevelCard
              key={level.levelId}
              level={level}
              completedItems={
                completedItems
              }
              isUnlocked={
                isUnlocked
              }
              onClick={() =>
                onSelectLevel(
                  level.levelId
                )
              }
            />
          );
        })}
      </section>
    </main>
  );
}