import {
  useState,
  type FormEvent,
} from "react";

import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { BrandHeader } from "../components/navigation/BrandHeader";

import type { IRegisterForm } from "../interfaces/IRegisterForm";

interface RegisterPageProps {
  onGoToLogin: () => void;

  onRegister: (
    email: string,
    password: string
  ) => Promise<void>;
}

export function RegisterPage({
  onGoToLogin,
  onRegister,
}: RegisterPageProps) {
  const [formData, setFormData] =
    useState<IRegisterForm>({
      email: "",
      password: "",
      confirmPassword: "",
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

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    if (formData.password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );

      return;
    }

    setIsSubmitting(true);

    try {
      await onRegister(
        formData.email,
        formData.password
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create account."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <BrandHeader subtitle="Little words. Big voices." />

        <div className="register-intro">
          <h2>Create your account</h2>

          <p>
            Create a parent or caregiver
            account to save your child's
            learning journey and progress.
          </p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
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
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              value={formData.password}
              placeholder="Create a password"
              autoComplete="new-password"
              required
              minLength={8}
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

          <div className="form-group">
            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type="password"
              value={
                formData.confirmPassword
              }
              placeholder="Enter your password again"
              autoComplete="new-password"
              required
              minLength={8}
              disabled={isSubmitting}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  confirmPassword:
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
                ? "Creating Account..."
                : "Create Account"
            }
            type="submit"
            disabled={isSubmitting}
          />
        </form>

        <div className="register-footer">
          <p>
            Already have an account?
          </p>

          <button
            type="button"
            className="text-button"
            onClick={onGoToLogin}
            disabled={isSubmitting}
          >
            Sign in
          </button>
        </div>
      </section>
    </main>
  );
}