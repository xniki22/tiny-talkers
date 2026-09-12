import { useState } from "react";

import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { SoundButton } from "../components/buttons/SoundButton";
import { ProgressBar } from "../components/feedback/ProgressBar";
import { ObjectImage } from "../components/learning/ObjectImage";

import { browserAudioService } from "../services/BrowserAudioService";

import type { ILevel } from "../interfaces/ILevel";

interface LessonPageProps {
  level: ILevel;
  completedItemIds: string[];

  onBack: () => void;

  onCompleteItem: (
    levelId: string,
    itemId: string
  ) => Promise<void>;

  onComplete: () => Promise<void>;
}

export function LessonPage({
  level,
  completedItemIds,
  onBack,
  onCompleteItem,
  onComplete,
}: LessonPageProps) {
  const firstIncompleteIndex =
    level.items.findIndex(
      (item) =>
        !completedItemIds.includes(item.itemId)
    );

  const startingIndex =
    firstIncompleteIndex === -1
      ? 0
      : firstIncompleteIndex;

  const [currentIndex, setCurrentIndex] =
    useState(startingIndex);

  const [isSaving, setIsSaving] =
    useState(false);

  const currentItem =
    level.items[currentIndex];

  const isLastItem =
    currentIndex === level.items.length - 1;

  const handleNext = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    browserAudioService.stopAudio();

    try {
      await onCompleteItem(
        level.levelId,
        currentItem.itemId
      );

      if (isLastItem) {
        await onComplete();
        return;
      }

      setCurrentIndex(
        (previousIndex) =>
          previousIndex + 1
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackItem = () => {
    browserAudioService.stopAudio();

    if (currentIndex > 0) {
      setCurrentIndex(
        (previousIndex) =>
          previousIndex - 1
      );
    }
  };

  const handleLeaveLesson = () => {
    browserAudioService.stopAudio();
    onBack();
  };

  const handleListen = () => {
    void browserAudioService.playAudio(
      currentItem.text
    );
  };

  return (
    <main className="lesson-page">
      <section className="lesson-container">
        <div className="lesson-top">
          <button
            type="button"
            className="lesson-back-button"
            onClick={handleLeaveLesson}
          >
            ← Levels
          </button>

          <span className="lesson-level-label">
            Level {level.levelNumber}
          </span>
        </div>

        <ProgressBar
          current={currentIndex + 1}
          total={level.items.length}
        />

        <section className="lesson-content">
          <p className="lesson-instruction">
            Listen and say it with me
          </p>

          <ObjectImage
            imageUrl={currentItem.imageUrl}
            altText={currentItem.text}
          />

          <h1 className="lesson-word">
            {currentItem.text}
          </h1>

          <SoundButton
            label="Listen"
            onClick={handleListen}
            disabled={isSaving}
          />

          <p className="lesson-encouragement">
            Now try saying it out loud!
          </p>
        </section>

        <div className="lesson-navigation">
          <button
            type="button"
            className="secondary-button"
            onClick={handleBackItem}
            disabled={
              currentIndex === 0 ||
              isSaving
            }
          >
            Back
          </button>

          <PrimaryButton
            label={
              isSaving
                ? "Saving..."
                : isLastItem
                  ? "Finish Level"
                  : "Next"
            }
            onClick={() => {
              void handleNext();
            }}
            disabled={isSaving}
          />
        </div>
      </section>
    </main>
  );
}