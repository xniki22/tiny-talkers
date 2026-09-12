import { useState } from "react";

import type { IChildProfile } from "../interfaces/IChildProfile";

interface ChildProfilePageProps {
  children: IChildProfile[];

  onSelectChild: (
    child: IChildProfile
  ) => void;

  onCreateChild: (
    displayName: string,
    avatar: string
  ) => Promise<void>;

  onLogout: () => Promise<void>;
}

export function ChildProfilePage({
  children,
  onSelectChild,
  onCreateChild,
  onLogout,
}: ChildProfilePageProps) {
  const [displayName, setDisplayName] =
    useState("");

  const [avatar, setAvatar] =
    useState("fox");

  const [isCreating, setIsCreating] =
    useState(false);

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const handleCreateChild = async () => {
    if (displayName.trim() === "") {
      return;
    }

    setIsCreating(true);

    try {
      await onCreateChild(
        displayName.trim(),
        avatar
      );

      setDisplayName("");
      setAvatar("fox");
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="child-profile-page">
      <section className="child-profile-container">

        <div className="child-profile-top">
          <div>
            <p>Tiny Talkers</p>

            <h1>
              Who is learning today?
            </h1>

            <p>
              Choose a child profile or create
              a new one.
            </p>
          </div>

          <button
            type="button"
            className="text-button"
            disabled={isLoggingOut}
            onClick={() => {
              void handleLogout();
            }}
          >
            {isLoggingOut
              ? "Logging Out..."
              : "Log Out"}
          </button>
        </div>

        <section className="child-profile-list">
          {children.map((child) => (
            <button
              key={child.childId}
              type="button"
              className="child-profile-card"
              onClick={() =>
                onSelectChild(child)
              }
            >
              <div className="child-avatar">
                {child.avatar === "fox" && "🦊"}
                {child.avatar === "bear" && "🐻"}
                {child.avatar === "bunny" && "🐰"}
                {child.avatar === "panda" && "🐼"}
              </div>

              <span>
                {child.displayName}
              </span>
            </button>
          ))}
        </section>

        <section className="create-child-section">
          <h2>Add a child</h2>

          <label>
            Name

            <input
              type="text"
              value={displayName}
              onChange={(event) =>
                setDisplayName(
                  event.target.value
                )
              }
              placeholder="Child's name"
            />
          </label>

          <div className="avatar-options">
            {[
              "fox",
              "bear",
              "bunny",
              "panda",
            ].map((option) => (
              <button
                key={option}
                type="button"
                className={
                  avatar === option
                    ? "avatar-option selected"
                    : "avatar-option"
                }
                aria-pressed={
                  avatar === option
                }
                onClick={() =>
                  setAvatar(option)
                }
              >
                {option === "fox" && "🦊"}
                {option === "bear" && "🐻"}
                {option === "bunny" && "🐰"}
                {option === "panda" && "🐼"}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              void handleCreateChild();
            }}
            disabled={
              isCreating ||
              displayName.trim() === ""
            }
          >
            {isCreating
              ? "Creating..."
              : "Create Profile"}
          </button>
        </section>

      </section>
    </main>
  );
}