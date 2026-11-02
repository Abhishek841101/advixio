
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  UserRound,
  Building2,
  MapPin,
  ShieldCheck,
  Mail,
  Phone,
  LockKeyhole,
  Save,
  Pencil,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  Hash,
  FileText,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Profile = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  companySlug?: string;
  businessType?: string;
  gstNumber?: string;
  businessDescription?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
};

type ProfileSection = "personal" | "business" | "address";

const emptyProfile: Profile = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  companySlug: "",
  businessType: "",
  gstNumber: "",
  businessDescription: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [form, setForm] = useState<Profile>(emptyProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<ProfileSection | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("advixio_token")
      : null;

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("advixio_token")}`,
    "Content-Type": "application/json",
  });

  const showMessage = (message: string, isError = false) => {
    setError(isError ? message : "");
    setSuccess(isError ? "" : message);
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const currentToken = localStorage.getItem("advixio_token");

      if (!currentToken) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("advixio_token");
        localStorage.removeItem("advixio_user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load profile");
      }

      const user: Profile = result.data;

      setProfile(user);
      setForm({
        ...emptyProfile,
        ...user,
      });

      // Keep dashboard user data synchronized.
      localStorage.setItem(
        "advixio_user",
        JSON.stringify({
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          companyName: user.companyName,
          city: user.city,
          state: user.state,
        })
      );
    } catch (err) {
      showMessage(
        err instanceof Error ? err.message : "Something went wrong",
        true
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateField = (field: keyof Profile, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const startEditing = (section: ProfileSection) => {
    setForm({ ...profile });
    setEditing(section);
    setError("");
    setSuccess("");
  };

  const cancelEditing = () => {
    setForm({ ...profile });
    setEditing(null);
    setError("");
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editing) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const fields: Record<ProfileSection, (keyof Profile)[]> = {
        personal: ["name", "phone"],
        business: [
          "companyName",
          "businessType",
          "gstNumber",
          "businessDescription",
        ],
        address: ["address", "city", "state", "pincode"],
      };

      const payload: Record<string, string> = {};

      fields[editing].forEach((field) => {
        payload[field] = String(form[field] ?? "").trim();
      });

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("advixio_token");
        localStorage.removeItem("advixio_user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Profile update failed");
      }

      setProfile(result.data);
      setForm({
        ...emptyProfile,
        ...result.data,
      });

      localStorage.setItem(
        "advixio_user",
        JSON.stringify({
          id: result.data._id || result.data.id,
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone,
          companyName: result.data.companyName,
          city: result.data.city,
          state: result.data.state,
        })
      );

      setEditing(null);
      showMessage("Your profile has been updated successfully.");
    } catch (err) {
      showMessage(
        err instanceof Error ? err.message : "Failed to update profile",
        true
      );
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (passwords.newPassword.length < 8) {
      showMessage("New password must contain at least 8 characters.", true);
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      showMessage("New password and confirm password do not match.", true);
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch(
        `${API_URL}/auth/change-password`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        // Incorrect current password should not log out the user.
        if (result.message?.toLowerCase().includes("current password")) {
          throw new Error(result.message);
        }

        localStorage.removeItem("advixio_token");
        localStorage.removeItem("advixio_user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Password change failed");
      }

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordForm(false);
      showMessage("Password changed successfully. Please login again.");

      localStorage.removeItem("advixio_token");
      localStorage.removeItem("advixio_user");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      showMessage(
        err instanceof Error ? err.message : "Password change failed",
        true
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const initials = profile.name
    ? profile.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "U";

  const Field = ({
    label,
    value,
    field,
    placeholder,
    type = "text",
    multiline = false,
    disabled = false,
  }: {
    label: string;
    value?: string;
    field?: keyof Profile;
    placeholder?: string;
    type?: string;
    multiline?: boolean;
    disabled?: boolean;
  }) => {
    const isEditing =
      editing !== null && !disabled && field !== undefined;

    return (
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          {label}
        </label>

        {isEditing ? (
          multiline ? (
            <textarea
              value={String(form[field] ?? "")}
              onChange={(e) => updateField(field, e.target.value)}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              rows={4}
              maxLength={field === "businessDescription" ? 1000 : undefined}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          ) : (
            <input
              type={type}
              value={String(form[field] ?? "")}
              onChange={(e) => updateField(field, e.target.value)}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              maxLength={field === "name" ? 100 : undefined}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          )
        ) : (
          <div className="min-h-12 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 break-words">
            {value || (
              <span className="font-normal text-slate-400">
                Not provided
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const SectionActions = ({
    section,
  }: {
    section: ProfileSection;
  }) => {
    if (editing !== section) {
      return (
        <button
          type="button"
          onClick={() => startEditing(section)}
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
        >
          <Pencil size={15} />
          Edit
        </button>
      );
    }

    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={cancelEditing}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          <X size={15} />
          Cancel
        </button>

        <button
          type="submit"
          form={`profile-${section}`}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={35} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-7">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your personal information and business account.
            </p>
          </div>

          <button
            onClick={loadProfile}
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm hover:border-indigo-200 hover:text-indigo-600"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            {success}
          </div>
        )}

        {/* Profile Overview */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-500" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-11 flex flex-wrap items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-indigo-100 text-3xl font-extrabold text-indigo-700 shadow-sm">
                {initials}
              </div>

              <div className="flex-1 pb-1">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {profile.name || "Your Name"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {profile.companyName || "Supplier Account"}
                </p>
              </div>

              <div className="pb-1">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
                    profile.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {profile.isActive ? "Active Account" : "Inactive Account"}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Email Address</p>
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Phone size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Phone Number</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {profile.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {[profile.city, profile.state].filter(Boolean).join(", ") ||
                      "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <UserRound size={21} />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900">
                  Personal Information
                </h2>
                <p className="text-xs text-slate-500">
                  Your basic account information
                </p>
              </div>
            </div>

            <SectionActions section="personal" />
          </div>

          <form id="profile-personal" onSubmit={saveProfile}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Full Name"
                value={profile.name}
                field="name"
              />

              <Field
                label="Email Address"
                value={profile.email}
                disabled
              />

              <Field
                label="Phone Number"
                value={profile.phone}
                field="phone"
                placeholder="Enter your phone number"
              />
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Email address cannot be edited here. Email changes require verification.
            </p>
          </form>
        </section>

        {/* Business Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Building2 size={21} />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900">
                  Business Information
                </h2>
                <p className="text-xs text-slate-500">
                  Your company and business details
                </p>
              </div>
            </div>

            <SectionActions section="business" />
          </div>

          <form id="profile-business" onSubmit={saveProfile}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Company Name"
                value={profile.companyName}
                field="companyName"
              />

              <Field
                label="Business Type"
                value={profile.businessType}
                field="businessType"
                placeholder="Manufacturer / Trader / Distributor"
              />

              <Field
                label="GST Number"
                value={profile.gstNumber}
                field="gstNumber"
                placeholder="Enter GST number"
              />

              <Field
                label="Company Slug"
                value={profile.companySlug}
                disabled
              />

              <div className="sm:col-span-2">
                <Field
                  label="Business Description"
                  value={profile.businessDescription}
                  field="businessDescription"
                  multiline
                  placeholder="Describe your company and products..."
                />
              </div>
            </div>
          </form>
        </section>

        {/* Address Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <MapPin size={21} />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900">
                  Address Information
                </h2>
                <p className="text-xs text-slate-500">
                  Your business location
                </p>
              </div>
            </div>

            <SectionActions section="address" />
          </div>

          <form id="profile-address" onSubmit={saveProfile}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  label="Complete Address"
                  value={profile.address}
                  field="address"
                  placeholder="Building, street, area..."
                />
              </div>

              <Field
                label="City"
                value={profile.city}
                field="city"
              />

              <Field
                label="State"
                value={profile.state}
                field="state"
              />

              <Field
                label="PIN Code"
                value={profile.pincode}
                field="pincode"
                placeholder="Enter PIN code"
              />
            </div>
          </form>
        </section>

        {/* Account Verification */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={21} />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900">
                Account Verification
              </h2>
              <p className="text-xs text-slate-500">
                Your contact verification status
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-slate-500" />
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Email Verification
                  </p>
                  <p className="text-xs text-slate-400">
                    {profile.email}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                  profile.isEmailVerified
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {profile.isEmailVerified ? "Verified" : "Pending"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-slate-500" />
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Phone Verification
                  </p>
                  <p className="text-xs text-slate-400">
                    {profile.phone || "No phone number"}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                  profile.isPhoneVerified
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {profile.isPhoneVerified ? "Verified" : "Pending"}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            OTP verification will be required to verify your email and phone number.
          </p>
        </section>

        {/* Security */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <LockKeyhole size={21} />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900">
                  Account Security
                </h2>
                <p className="text-xs text-slate-500">
                  Keep your account password secure
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                setError("");
                setSuccess("");
              }}
              className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-100"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showPasswordForm && (
            <form
              onSubmit={changePassword}
              className="mt-6 space-y-5 border-t border-slate-100 pt-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Current Password
                  </label>

                  <div className="relative">
                    <input
                      required
                      type={showCurrentPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      required
                      minLength={8}
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Minimum 8 characters"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Confirm New Password
                  </label>

                  <input
                    required
                    minLength={8}
                    type="password"
                    autoComplete="new-password"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {changingPassword ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <LockKeyhole size={17} />
                )}
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </section>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 text-xs text-slate-400">
          <p>Advixio360 Supplier Account Management</p>

          <Link
            href="/dashboard"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
