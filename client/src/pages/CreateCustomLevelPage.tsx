import {
  useState,
} from "react";

import { PrimaryButton } from "../components/buttons/PrimaryButton";

import {
  customLevelService,
} from "../services/CustomLevelService";

import type {
  CustomLearningItemType,
  ICustomLevel,
  ICustomLevelItemInput,
} from "../interfaces/ICustomLevel";

interface CreateCustomLevelPageProps {
  childId: string;

  childName: string;

  onBack: () => void;

  onSave: (
    title: string,
    items: ICustomLevelItemInput[]
  ) => Promise<ICustomLevel>;
}

interface EditableItem {
  text: string;
  type: CustomLearningItemType;
}

const createEmptyItem =
  (): EditableItem => ({
    text: "",
    type: "WORD",
  });

export function CreateCustomLevelPage({
  childId,
  childName,
  onBack,
  onSave,
}: CreateCustomLevelPageProps) {
  const [
    topic,
    setTopic,
  ] = useState("");

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    items,
    setItems,
  ] = useState<EditableItem[]>([
    createEmptyItem(),
  ]);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    isGenerating,
    setIsGenerating,
  ] = useState(false);

  const handleGenerate = async () => {
    setErrorMessage("");

    const trimmedTopic =
      topic.trim();

    if (!trimmedTopic) {
      setErrorMessage(
        "Please describe what you would like your child to practice."
      );

      return;
    }

    setIsGenerating(true);

    try {
      const generatedLevel =
        await customLevelService
          .generateCustomLevel(
            childId,
            childName,
            trimmedTopic
          );

      setTitle(
        generatedLevel.title
      );

      setItems(
        generatedLevel.items.map(
          (item) => ({
            text:
              item.text,

            type:
              item.type,
          })
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message
        );
      } else {
        setErrorMessage(
          "Could not generate a custom level."
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleItemTextChange = (
    index: number,
    text: string
  ) => {
    setItems(
      (previousItems) =>
        previousItems.map(
          (item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  text,
                }
              : item
        )
    );
  };

  const handleItemTypeChange = (
    index: number,
    type: CustomLearningItemType
  ) => {
    setItems(
      (previousItems) =>
        previousItems.map(
          (item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  type,
                }
              : item
        )
    );
  };

  const handleAddItem = () => {
    if (items.length >= 5) {
      return;
    }

    setItems(
      (previousItems) => [
        ...previousItems,
        createEmptyItem(),
      ]
    );
  };

  const handleRemoveItem = (
    index: number
  ) => {
    if (items.length <= 1) {
      return;
    }

    setItems(
      (previousItems) =>
        previousItems.filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
    );
  };

  const handleSave = async () => {
    setErrorMessage("");

    const trimmedTitle =
      title.trim();

    if (!trimmedTitle) {
      setErrorMessage(
        "Please enter a level title."
      );

      return;
    }

    const normalizedItems =
      items
        .map((item) => ({
          text:
            item.text.trim(),

          type:
            item.type,
        }))
        .filter(
          (item) =>
            item.text.length > 0
        );

    if (
      normalizedItems.length === 0
    ) {
      setErrorMessage(
        "Please add at least one word, phrase, or sentence."
      );

      return;
    }

    setIsSaving(true);

    try {
      await onSave(
        trimmedTitle,
        normalizedItems
      );
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message
        );
      } else {
        setErrorMessage(
          "Could not save the custom level."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const controlsDisabled =
    isSaving ||
    isGenerating;

  return (
    <main className="custom-level-page">
      <section className="custom-level-container">
        <button
          type="button"
          className="lesson-back-button"
          onClick={onBack}
          disabled={
            controlsDisabled
          }
        >
          ← Back
        </button>

        <div className="custom-level-heading">
          <p className="learning-eyebrow">
            Tiny Talkers
          </p>

          <h1>
            Create a custom level
          </h1>

          <p>
            Create personalized speech
            practice for{" "}
            <strong>
              {childName}
            </strong>
            .
          </p>
        </div>

        <section className="custom-level-card">
          <div className="form-group">
            <label htmlFor="custom-level-topic">
              What should {childName} practice?
            </label>

            <textarea
              id="custom-level-topic"
              maxLength={300}
              value={topic}
              placeholder="Example: words and short phrases about going to the zoo"
              onChange={(event) =>
                setTopic(
                  event.target.value
                )
              }
              disabled={
                controlsDisabled
              }
              rows={4}
            />

            <p className="custom-ai-helper">
              AI will create five practice
              items. You can review and edit
              everything before saving.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button custom-generate-button"
            onClick={() => {
              void handleGenerate();
            }}
            disabled={
              controlsDisabled
            }
          >
            {isGenerating
              ? "Generating..."
              : "Generate with AI ✨"}
          </button>

          <div className="custom-ai-review-note">
            <strong>
              Parent review required:
            </strong>{" "}
            AI suggestions are only drafts
            and are not saved until you
            approve them.
          </div>

          <div className="form-group">
            <label htmlFor="custom-level-title">
              Level title
            </label>

            <input
              id="custom-level-title"
              type="text"
              maxLength={80}
              value={title}
              placeholder="Example: Family Words"
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              disabled={
                controlsDisabled
              }
            />
          </div>

          <div className="custom-items-heading">
            <div>
              <h2>
                Practice items
              </h2>

              <p>
                Review and edit the generated
                words, phrases, or sentences.
              </p>
            </div>

            <span>
              {items.length} / 5
            </span>
          </div>

          <div className="custom-item-list">
            {items.map(
              (item, index) => (
                <div
                  className="custom-item-editor"
                  key={index}
                >
                  <div className="custom-item-number">
                    {index + 1}
                  </div>

                  <div className="custom-item-fields">
                    <input
                      type="text"
                      maxLength={120}
                      value={item.text}
                      placeholder="Example: Grandma"
                      onChange={(event) =>
                        handleItemTextChange(
                          index,
                          event.target.value
                        )
                      }
                      disabled={
                        controlsDisabled
                      }
                    />

                    <select
                      value={item.type}
                      onChange={(event) =>
                        handleItemTypeChange(
                          index,
                          event.target
                            .value as CustomLearningItemType
                        )
                      }
                      disabled={
                        controlsDisabled
                      }
                    >
                      <option value="WORD">
                        Word
                      </option>

                      <option value="PHRASE">
                        Phrase
                      </option>

                      <option value="SENTENCE">
                        Sentence
                      </option>
                    </select>
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      className="custom-remove-button"
                      onClick={() =>
                        handleRemoveItem(
                          index
                        )
                      }
                      disabled={
                        controlsDisabled
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
              )
            )}
          </div>

          {items.length < 5 && (
            <button
              type="button"
              className="secondary-button custom-add-button"
              onClick={
                handleAddItem
              }
              disabled={
                controlsDisabled
              }
            >
              Add another item
            </button>
          )}

          {errorMessage && (
            <p className="custom-level-error">
              {errorMessage}
            </p>
          )}

          <div className="custom-level-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onBack}
              disabled={
                controlsDisabled
              }
            >
              Cancel
            </button>

            <PrimaryButton
              label={
                isSaving
                  ? "Saving..."
                  : "Save Level"
              }
              onClick={() => {
                void handleSave();
              }}
              disabled={
                controlsDisabled
              }
            />
          </div>
        </section>
      </section>
    </main>
  );
}