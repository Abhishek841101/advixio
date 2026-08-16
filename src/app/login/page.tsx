"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
process.env.NEXT_PUBLIC_API_URL ||
"http://localhost:5000/api";

type User = {
id: string;
name: string;
email: string;
phone?: string;
companyName?: string;
city?: string;
state?: string;
};

type LoginResponse = {
success: boolean;
message: string;
data?: {
token: string;
user: User;
};
};

export default function LoginPage() {
const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleSubmit = async (
event: FormEvent<HTMLFormElement>
) => {
event.preventDefault();


setError("");

if (!email.trim()) {
  setError("Please enter your email.");
  return;
}

if (!password) {
  setError("Please enter your password.");
  return;
}

try {
  setLoading(true);

  const loginUrl =
    API_URL + "/auth/login";

  const response = await fetch(
    loginUrl,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email.trim(),
        password: password,
      }),
    }
  );

  const result =
    (await response.json()) as LoginResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ||
        "Invalid email or password."
    );
  }

  const token = result.data?.token;
  const user = result.data?.user;

  if (!token || !user) {
    throw new Error(
      "Login successful, but user information was not received."
    );
  }

  localStorage.setItem(
    "advixio_token",
    token
  );

  localStorage.setItem(
    "advixio_user",
    JSON.stringify(user)
  );

window.location.href = "/";
} catch (error) {
  console.error(
    "Login error:",
    error
  );

  setError(
    error instanceof Error
      ? error.message
      : "Unable to login. Please try again."
  );
} finally {
  setLoading(false);
}


};

return ( <main className="auth-page">


  <div className="auth-container">

    <div className="auth-header">

      <span className="auth-label">
        ADVIXIO
      </span>

      <h1>
        Welcome Back
      </h1>

      <p>
        Login to your Advixio account.
      </p>

    </div>

    <form
      className="auth-form"
      onSubmit={handleSubmit}
    >

      {error && (
        <div
          className="auth-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="auth-field">

        <label htmlFor="email">
          Email Address *
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value
            )
          }
          placeholder="Enter your email"
          autoComplete="email"
          disabled={loading}
          required
        />

      </div>

      <div className="auth-field">

        <label htmlFor="password">
          Password *
        </label>

        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value
            )
          }
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={loading}
          required
        />

      </div>

      <button
        type="submit"
        className="auth-submit-button"
        disabled={loading}
      >
        {loading
          ? "Logging in..."
          : "Login"}
      </button>

    </form>

    <div className="auth-footer">

      <span>
        Don't have an account?
      </span>

      <Link href="/register">
        Create Account
      </Link>

    </div>

  </div>

</main>


);
}
