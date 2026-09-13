interface LevelCompletePageProps {
  levelNumber: number;
  levelTitle: string;
  totalStars: number;
  onContinue: () => void;
}

export function LevelCompletePage({
  levelNumber,
  levelTitle,
  totalStars,
  onContinue,
}: LevelCompletePageProps) {
  return (
    <main className="level-complete-page">
      <section className="level-complete-card">
        <div className="level-complete-icon">
          🎉
        </div>

        <p className="level-complete-label">
          Level {levelNumber} complete
        </p>

        <h1>Great job!</h1>

        <p>
          You finished {levelTitle}.
        </p>

        <div className="level-reward">
          <div className="level-reward-star">
            ⭐
          </div>

          <h2>
            You earned a star!
          </h2>

          <p>
            Total stars:{" "}
            <strong>
              {totalStars}
            </strong>
          </p>
        </div>

        <button
          type="button"
          className="complete-button"
          onClick={onContinue}
        >
          Continue Learning
        </button>
      </section>
    </main>
  );
}