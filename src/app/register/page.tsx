"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type RegisterForm = {
name: string;
email: string;
phone: string;
password: string;
confirmPassword: string;
companyName: string;
city: string;
state: string;
};

type RegisterResponse = {
success: boolean;
message: string;
data?: {
token: string;
user: {
id: string;
name: string;
email: string;
phone?: string;
companyName?: string;
city?: string;
state?: string;
};
};
};

export default function RegisterPage() {
const router = useRouter();

const [form, setForm] = useState<RegisterForm>({
name: "",
email: "",
phone: "",
password: "",
confirmPassword: "",
companyName: "",
city: "",
state: "",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const handleChange = (
event: React.ChangeEvent<HTMLInputElement>
) => {
const { name, value } = event.target;


setForm((current) => ({
  ...current,
  [name]: value,
}));


};

const handleSubmit = async (
event: FormEvent<HTMLFormElement>
) => {
event.preventDefault();


setError("");
setSuccess("");

/* ==============================
   FRONTEND VALIDATION
============================== */

if (!form.name.trim()) {
  setError("Please enter your name.");
  return;
}

if (!form.email.trim()) {
  setError("Please enter your email.");
  return;
}

if (!form.password) {
  setError("Please enter a password.");
  return;
}

if (form.password.length < 6) {
  setError(
    "Password must be at least 6 characters long."
  );
  return;
}

if (
  form.password !== form.confirmPassword
) {
  setError("Passwords do not match.");
  return;
}

try {
  setLoading(true);

  /* ==============================
     REGISTER API
  ============================== */

  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        companyName:
          form.companyName.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
      }),
    }
  );

  const result: RegisterResponse =
    await response.json();

  /* ==============================
     API ERROR
  ============================== */

  if (
    !response.ok ||
    !result.success
  ) {
    throw new Error(
      result.message ||
        "Unable to create account."
    );
  }

  /* ==============================
     CHECK TOKEN + USER
  ============================== */

  const token = result.data?.token;
  const user = result.data?.user;

  if (!token || !user) {
    throw new Error(
      "Account created, but authentication information was not received."
    );
  }

  /* ==============================
     SAVE LOGIN SESSION
  ============================== */

  localStorage.setItem(
    "advixio_token",
    token
  );

  localStorage.setItem(
    "advixio_user",
    JSON.stringify(user)
  );

  /* ==============================
     SUCCESS
  ============================== */

  setSuccess(
    "Account created successfully!"
  );

  /* ==============================
     DASHBOARD REDIRECT
  ============================== */

  setTimeout(() => {
   router.push("/");
    router.refresh();
  }, 700);

} catch (error) {
  console.error(
    "Registration error:",
    error
  );

  setError(
    error instanceof Error
      ? error.message
      : "Something went wrong while creating your account."
  );
} finally {
  setLoading(false);
}


};

return ( <main className="auth-page">


  <div className="auth-container">

    {/* ==============================
        HEADER
    ============================== */}

    <div className="auth-header">

      <span className="auth-label">
        ADVIXIO
      </span>

      <h1>
        Create Account
      </h1>

      <p>
        Create your Advixio account and
        start connecting with businesses.
      </p>

    </div>


    {/* ==============================
        FORM
    ============================== */}

    <form
      className="auth-form"
      onSubmit={handleSubmit}
    >

      {/* ERROR */}

      {error && (
        <div
          className="auth-error"
          role="alert"
        >
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {success && (
        <div
          className="auth-success"
          role="status"
        >
          {success}
        </div>
      )}


      {/* NAME */}

      <div className="auth-field">

        <label htmlFor="name">
          Full Name *
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          autoComplete="name"
          disabled={loading}
          required
        />

      </div>


      {/* EMAIL */}

      <div className="auth-field">

        <label htmlFor="email">
          Email Address *
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          autoComplete="email"
          disabled={loading}
          required
        />

      </div>


      {/* PHONE */}

      <div className="auth-field">

        <label htmlFor="phone">
          Phone Number
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          autoComplete="tel"
          disabled={loading}
        />

      </div>


      {/* PASSWORD ROW */}

      <div className="auth-row">

        <div className="auth-field">

          <label htmlFor="password">
            Password *
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            disabled={loading}
            required
          />

        </div>


        <div className="auth-field">

          <label htmlFor="confirmPassword">
            Confirm Password *
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={
              form.confirmPassword
            }
            onChange={handleChange}
            placeholder="Confirm password"
            autoComplete="new-password"
            disabled={loading}
            required
          />

        </div>

      </div>


      {/* BUSINESS */}

      <div className="auth-section-title">
        Business Information
      </div>


      {/* COMPANY */}

      <div className="auth-field">

        <label htmlFor="companyName">
          Company Name
        </label>

        <input
          id="companyName"
          name="companyName"
          type="text"
          value={
            form.companyName
          }
          onChange={handleChange}
          placeholder="Enter company name"
          autoComplete="organization"
          disabled={loading}
        />

      </div>


      {/* CITY + STATE */}

      <div className="auth-row">

        <div className="auth-field">

          <label htmlFor="city">
            City
          </label>

          <input
            id="city"
            name="city"
            type="text"
            value={form.city}
            onChange={handleChange}
            placeholder="Enter city"
            autoComplete="address-level2"
            disabled={loading}
          />

        </div>


        <div className="auth-field">

          <label htmlFor="state">
            State
          </label>

          <input
            id="state"
            name="state"
            type="text"
            value={form.state}
            onChange={handleChange}
            placeholder="Enter state"
            autoComplete="address-level1"
            disabled={loading}
          />

        </div>

      </div>


      {/* SUBMIT */}

      <button
        type="submit"
        className="auth-submit-button"
        disabled={loading}
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </button>

    </form>


    {/* ==============================
        LOGIN LINK
    ============================== */}

    <div className="auth-footer">

      <span>
        Already have an account?
      </span>

      <Link href="/login">
        Login
      </Link>

    </div>

  </div>

</main>


);
}
