import {
  useState,
  type FormEvent,
} from "react";

import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { BrandHeader } from "../components/navigation/BrandHeader";

import type { ILoginForm } from "../interfaces/ILoginForm";

interface LoginPageProps {
  onGoToRegister: () => void;

  onLogin: (
    email: string,
    password: string
  ) => Promise<void>;
}

export function LoginPage({
  onGoToRegister,
  onLogin,
}: LoginPageProps) {
  const [formData, setFormData] =
    useState<ILoginForm>({
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await onLogin(
        formData.email,
        formData.password
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <BrandHeader subtitle="Little words. Big voices." />

        <div className="login-intro">
          <h2>Welcome!</h2>

          <p>
            Parents and caregivers can sign in
            to continue their child's learning
            journey.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={formData.email}
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={isSubmitting}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  email:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={formData.password}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={isSubmitting}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  password:
                    event.target.value,
                })
              }
            />
          </div>

          {error && (
            <p
              className="form-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <PrimaryButton
            label={
              isSubmitting
                ? "Signing In..."
                : "Sign In"
            }
            type="submit"
            disabled={isSubmitting}
          />
        </form>

        <div className="login-footer">
          <p>New to Tiny Talkers?</p>

          <button
            type="button"
            className="text-button"
            onClick={onGoToRegister}
            disabled={isSubmitting}
          >
            Create a parent account
          </button>
        </div>
      </section>
    </main>
  );
}