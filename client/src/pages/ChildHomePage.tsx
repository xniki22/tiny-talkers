import { LevelCard } from "../components/learning/LevelCard";

import { levels } from "../data/levels";

import type {
  ICustomLevel,
} from "../interfaces/ICustomLevel";

interface ChildHomePageProps {
  childName: string;

  completedLevelIds: string[];

  completedItemCounts: Record<
    string,
    number
  >;

  customLevels: ICustomLevel[];

  onSelectLevel: (
    levelId: string
  ) => void;

  onSelectCustomLevel: (
    customLevel: ICustomLevel
  ) => void;

  onCreateCustomLevel: () => void;

  onDeleteCustomLevel: (
    customLevelId: string
  ) => Promise<void>;

  onSwitchProfile: () => void;

  onLogout: () => Promise<void>;
}

export function ChildHomePage({
  childName,
  completedLevelIds,
  completedItemCounts,
  customLevels,
  onSelectLevel,
  onSelectCustomLevel,
  onCreateCustomLevel,
  onDeleteCustomLevel,
  onSwitchProfile,
  onLogout,
}: ChildHomePageProps) {
  const totalStars =
    completedLevelIds.length;

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
              <strong>
                {childName}
              </strong>
            </p>

            <div className="learning-star-count">
              <span className="learning-star-icon">
                ⭐
              </span>

              <span>
                <strong>
                  {totalStars}
                </strong>{" "}
                {totalStars === 1
                  ? "Star Earned"
                  : "Stars Earned"}
              </span>
            </div>
          </div>

          <div className="learning-home-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={
                onSwitchProfile
              }
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
          Choose a level and practice new
          words, phrases, and sentences.
        </p>
      </section>

      <section className="learning-section">
        <div className="learning-section-heading">
          <div>
            <p className="learning-section-label">
              Learning Path
            </p>

            <h2>
              Core Levels
            </h2>
          </div>
        </div>

        <div className="level-list">
          {levels.map(
            (level, index) => {
              const previousLevel =
                index > 0
                  ? levels[
                      index - 1
                    ]
                  : null;

              const isUnlocked =
                index === 0 ||
                (
                  previousLevel !==
                    null &&
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
                  key={
                    level.levelId
                  }
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
            }
          )}
        </div>
      </section>

      <section className="learning-section custom-level-section">
        <div className="learning-section-heading custom-level-section-heading">
          <div>
            <p className="learning-section-label">
              Personalized Practice
            </p>

            <h2>
              Custom Levels
            </h2>

            <p>
              Create practice using words
              and sentences that are useful
              for {childName}.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={
              onCreateCustomLevel
            }
          >
            Create Custom Level
          </button>
        </div>

        {customLevels.length ===
        0 ? (
          <div className="custom-level-empty">
            <h3>
              No custom levels yet
            </h3>

            <p>
              Create a personalized level
              with words, phrases, or
              sentences you want{" "}
              {childName} to practice.
            </p>
          </div>
        ) : (
          <div className="custom-level-list">
            {customLevels.map(
              (customLevel) => (
                <article
                  className="custom-level-card-home"
                  key={
                    customLevel.customLevelId
                  }
                >
                  <button
                    type="button"
                    className="custom-level-open-button"
                    onClick={() =>
                      onSelectCustomLevel(
                        customLevel
                      )
                    }
                  >
                    <div className="custom-level-icon">
                      Aa
                    </div>

                    <div className="custom-level-card-content">
                      <span className="custom-level-badge">
                        Custom
                      </span>

                      <h3>
                        {
                          customLevel.title
                        }
                      </h3>

                      <p>
                        {
                          customLevel
                            .items.length
                        }{" "}
                        practice{" "}
                        {customLevel.items
                          .length === 1
                          ? "item"
                          : "items"}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="custom-delete-button"
                    onClick={() => {
                      void onDeleteCustomLevel(
                        customLevel.customLevelId
                      );
                    }}
                  >
                    Delete
                  </button>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}