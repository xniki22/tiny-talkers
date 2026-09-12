interface LevelCompletePageProps {
  levelNumber: number;
  levelTitle: string;
  onContinue: () => void;
}

export function LevelCompletePage({
  levelNumber,
  levelTitle,
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