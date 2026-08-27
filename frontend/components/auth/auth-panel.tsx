"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { getErrorMessage } from "@/lib/utils/format";
import type { Dictionary } from "@/i18n/dictionaries";
import { ErrorMessage } from "@/components/ui/error-message";

type AuthMode = "login" | "register";

export function AuthPanel(props: { readonly t: Dictionary }) {
  const auth = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await auth.login({ email: loginEmail, password: loginPassword });
    } catch (requestError) {
      setError(getErrorMessage(requestError, props.t.errorUnexpected));
    } finally {
      setLoading(false);
    }
  }

  async function submitRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await auth.register({
        firstName,
        lastName,
        email: registerEmail,
        password: registerPassword,
        jobTitle,
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError, props.t.errorUnexpected));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto mt-16 w-full max-w-md rounded-lg border border-riwi-line bg-riwi-panel p-5 shadow-sm">
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-md bg-riwi-subtle p-1">
        <button
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            mode === "login" ? "bg-riwi-panel text-riwi-primary-strong shadow-sm" : "text-riwi-muted"
          }`}
          onClick={() => setMode("login")}
          type="button"
        >
          {props.t.login}
        </button>
        <button
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            mode === "register" ? "bg-riwi-panel text-riwi-primary-strong shadow-sm" : "text-riwi-muted"
          }`}
          onClick={() => setMode("register")}
          type="button"
        >
          {props.t.register}
        </button>
      </div>

      {mode === "login" ? (
        <form className="space-y-4" onSubmit={submitLogin}>
          <TextInput
            autoComplete="email"
            label={props.t.email}
            onChange={setLoginEmail}
            type="email"
            value={loginEmail}
          />
          <TextInput
            autoComplete="current-password"
            label={props.t.password}
            onChange={setLoginPassword}
            type="password"
            value={loginPassword}
          />
          <SubmitButton loading={loading} loadingText={props.t.entering} text={props.t.enter} />
        </form>
      ) : (
        <form className="space-y-4" onSubmit={submitRegister}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextInput autoComplete="given-name" label={props.t.firstName} onChange={setFirstName} value={firstName} />
            <TextInput autoComplete="family-name" label={props.t.lastName} onChange={setLastName} value={lastName} />
          </div>
          <TextInput
            autoComplete="email"
            label={props.t.email}
            onChange={setRegisterEmail}
            type="email"
            value={registerEmail}
          />
          <TextInput autoComplete="organization-title" label={props.t.jobTitle} onChange={setJobTitle} value={jobTitle} />
          <TextInput
            autoComplete="new-password"
            label={props.t.password}
            minLength={8}
            onChange={setRegisterPassword}
            type="password"
            value={registerPassword}
          />
          <SubmitButton loading={loading} loadingText={props.t.creatingAccount} text={props.t.createAccount} />
        </form>
      )}

      {error ? <ErrorMessage message={error} /> : null}
    </section>
  );
}

function TextInput(props: {
  readonly autoComplete?: string;
  readonly label: string;
  readonly minLength?: number;
  readonly onChange: (value: string) => void;
  readonly type?: string;
  readonly value: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {props.label}
      <input
        autoComplete={props.autoComplete}
        className="mt-1 w-full rounded-md border border-riwi-line px-3 py-2 outline-none focus:border-riwi-primary"
        minLength={props.minLength}
        onChange={(event) => props.onChange(event.target.value)}
        required
        type={props.type ?? "text"}
        value={props.value}
      />
    </label>
  );
}

function SubmitButton(props: {
  readonly loading: boolean;
  readonly loadingText: string;
  readonly text: string;
}) {
  return (
    <button
      className="w-full rounded-md bg-riwi-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-riwi-primary-strong disabled:opacity-60"
      disabled={props.loading}
      type="submit"
    >
      {props.loading ? props.loadingText : props.text}
    </button>
  );
}
