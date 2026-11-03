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
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Profile = {
  _id?: string;
  id?: string;
  profileImage?: string;
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

/* =========================================
   REUSABLE PROFILE FIELD
   IMPORTANT: Keep this outside ProfilePage.
========================================= */

type ProfileFieldProps = {
  label: string;
  value?: string;
  field?: keyof Profile;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  disabled?: boolean;
  editing: ProfileSection | null;
  form: Profile;
  onChange: (field: keyof Profile, value: string) => void;
};

function ProfileField({
  label,
  value,
  field,
  placeholder,
  type = "text",
  multiline = false,
  disabled = false,
  editing,
  form,
  onChange,
}: ProfileFieldProps) {
  const isEditing =
    editing !== null && !disabled && field !== undefined;

  const inputClass =
    "profile-input w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50";

  return (
    <div className="min-w-0 space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {isEditing ? (
        multiline ? (
          <textarea
            value={String(form[field] ?? "")}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            rows={4}
            maxLength={
              field === "businessDescription" ? 1000 : undefined
            }
            className={`${inputClass} min-h-28 resize-y`}
          />
        ) : (
          <input
            type={type}
            value={String(form[field] ?? "")}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            maxLength={field === "name" ? 100 : undefined}
            className={inputClass}
          />
        )
      ) : (
        <div className="flex min-h-12 w-full min-w-0 items-center rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          <span className="min-w-0 break-words [overflow-wrap:anywhere]">
            {value || (
              <span className="font-normal text-slate-400">
                Not provided
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

/* =========================================
   SECTION ACTIONS
   IMPORTANT: Keep this outside ProfilePage.
========================================= */

type SectionActionsProps = {
  section: ProfileSection;
  editing: ProfileSection | null;
  saving: boolean;
  onEdit: (section: ProfileSection) => void;
  onCancel: () => void;
};

function SectionActions({
  section,
  editing,
  saving,
  onEdit,
  onCancel,
}: SectionActionsProps) {
  if (editing !== section) {
    return (
      <button
        type="button"
        onClick={() => onEdit(section)}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
      >
        <Pencil size={15} />
        Edit
      </button>
    );
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60 sm:px-4"
      >
        <X size={15} />
        Cancel
      </button>

      <button
        type="submit"
        form={`profile-${section}`}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60 sm:px-4"
      >
        {saving ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Save size={16} />
        )}
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

/* =========================================
   MAIN PROFILE PAGE
========================================= */

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [form, setForm] = useState<Profile>(emptyProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

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

  const showMessage = (message: string, isError = false) => {
    setError(isError ? message : "");
    setSuccess(isError ? "" : message);
  };

  /* =========================================
     LOAD PROFILE
  ========================================= */

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

      setImagePreview(user.profileImage || "");
      setProfileImage(null);

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

  /* =========================================
     FORM HANDLERS
  ========================================= */

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
    setProfileImage(null);
    setImagePreview(profile.profileImage || "");
    setEditing(null);
    setError("");
  };

  /* =========================================
     SAVE PROFILE
  ========================================= */

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

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("advixio_token")}`,
        },
        body: formData,
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

      const updatedProfile: Profile = result.data;

      setProfile(updatedProfile);
      setForm({
        ...emptyProfile,
        ...updatedProfile,
      });

      setImagePreview(updatedProfile.profileImage || "");
      setProfileImage(null);

      localStorage.setItem(
        "advixio_user",
        JSON.stringify({
          id: updatedProfile._id || updatedProfile.id,
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          companyName: updatedProfile.companyName,
          city: updatedProfile.city,
          state: updatedProfile.state,
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

  /* =========================================
     CHANGE PASSWORD
  ========================================= */

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

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("advixio_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
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

      window.setTimeout(() => {
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

  /* =========================================
     PROFILE IMAGE
  ========================================= */

  const handleImageChange = (file?: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image size must be less than 5 MB.", true);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showMessage("Please select a JPG, PNG or WEBP image.", true);
      return;
    }

    setProfileImage(file);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
      }
    };

    reader.readAsDataURL(file);

    setEditing("personal");
    setError("");
    setSuccess("");
  };

  /* =========================================
     INITIALS
  ========================================= */

  const initials = profile.name
    ? profile.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "U";

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="profile-page flex min-h-screen items-center justify-center bg-[#f6f7fb] px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={35} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  /* =========================================
     MAIN UI
  ========================================= */

  return (
    <main className="profile-page min-h-screen w-full bg-[#f6f7fb] px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 sm:gap-7">

        {/* HEADER */}
        <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
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

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage your personal information and business account.
            </p>
          </div>

          <button
            onClick={loadProfile}
            type="button"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 sm:w-auto"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {/* ALERTS */}
        {error && (
          <div className="flex min-w-0 items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700 sm:p-4">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <span className="min-w-0 break-words">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex min-w-0 items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-700 sm:p-4">
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            <span className="min-w-0 break-words">{success}</span>
          </div>
        )}

        {/* PROFILE OVERVIEW */}
        <section className="profile-overview min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-16 bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-500 sm:h-24" />

          <div className="px-4 pb-5 sm:px-7 sm:pb-6">
            <div className="-mt-9 flex min-w-0 flex-col gap-4 sm:-mt-11 sm:flex-row sm:flex-wrap sm:items-end">
              <div className="relative w-fit shrink-0">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-indigo-100 text-2xl font-extrabold text-indigo-700 shadow-sm sm:h-24 sm:w-24 sm:text-3xl">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <label
                  htmlFor="profile-image"
                  className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700"
                  title="Change profile photo"
                >
                  <Pencil size={15} />
                </label>

                <input
                  id="profile-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    handleImageChange(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <h2 className="break-words text-xl font-extrabold text-slate-900">
                  {profile.name || "Your Name"}
                </h2>

                <p className="mt-1 break-words text-sm text-slate-500">
                  {profile.companyName || "Supplier Account"}
                </p>
              </div>

              <div className="pb-1">
                <span
                  className={`inline-flex max-w-full items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
                    profile.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
                  {profile.isActive ? "Active Account" : "Inactive Account"}
                </span>
              </div>
            </div>

            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Email Address</p>
                  <p className="break-all text-sm font-semibold text-slate-700">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Phone size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Phone Number</p>
                  <p className="break-words text-sm font-semibold text-slate-700">
                    {profile.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-3 sm:col-span-2 lg:col-span-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="break-words text-sm font-semibold text-slate-700">
                    {[profile.city, profile.state].filter(Boolean).join(", ") ||
                      "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PERSONAL INFORMATION */}
        <section className="profile-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
          <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <UserRound size={21} />
              </div>
              <div className="min-w-0">
                <h2 className="font-extrabold text-slate-900">
                  Personal Information
                </h2>
                <p className="text-xs leading-5 text-slate-500">
                  Your basic account information
                </p>
              </div>
            </div>

            <SectionActions
              section="personal"
              editing={editing}
              saving={saving}
              onEdit={startEditing}
              onCancel={cancelEditing}
            />
          </div>

          <form id="profile-personal" onSubmit={saveProfile}>
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <ProfileField
                label="Full Name"
                value={profile.name}
                field="name"
                editing={editing}
                form={form}
                onChange={updateField}
              />

              <ProfileField
                label="Email Address"
                value={profile.email}
                disabled
                editing={editing}
                form={form}
                onChange={updateField}
              />

              <ProfileField
                label="Phone Number"
                value={profile.phone}
                field="phone"
                placeholder="Enter your phone number"
                editing={editing}
                form={form}
                onChange={updateField}
              />
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Email address cannot be edited here. Email changes require
              verification.
            </p>
          </form>
        </section>

        {/* BUSINESS INFORMATION */}
        <section className="profile-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
          <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Building2 size={21} />
              </div>
              <div className="min-w-0">
                <h2 className="font-extrabold text-slate-900">
                  Business Information
                </h2>
                <p className="text-xs leading-5 text-slate-500">
                  Your company and business details
                </p>
              </div>
            </div>

            <SectionActions
              section="business"
              editing={editing}
              saving={saving}
              onEdit={startEditing}
              onCancel={cancelEditing}
            />
          </div>

          <form id="profile-business" onSubmit={saveProfile}>
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <ProfileField
                label="Company Name"
                value={profile.companyName}
                field="companyName"
                editing={editing}
                form={form}
                onChange={updateField}
              />

              <ProfileField
                label="Business Type"
                value={profile.businessType}
                field="businessType"
                placeholder="Manufacturer / Trader / Distributor"
                editing={editing}
                form={form}
                onChange={updateField}
              />

              <ProfileField
                label="GST Number"
                value={profile.gstNumber}
                field="gstNumber"
                placeholder="Enter GST number"
                editing={editing}
                form={form}
                onChange={updateField}
              />

              <ProfileField
                label="Company Slug"
                value={profile.companySlug}
                disabled
                editing={editing}
                form={form}
                onChange={updateField}
              />

              <div className="min-w-0 sm:col-span-2">
                <ProfileField
                  label="Business Description"
                  value={profile.businessDescription}
                  field="businessDescription"
                  multiline
                  placeholder="Describe your company and products..."
                  editing={editing}
                  form={form}
                  onChange={updateField}
                />
              </div>
            </div>
          </form>
        </section>

        {/* ADDRESS INFORMATION */}
        <section className="profile-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
          <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <MapPin size={21} />
              </div>
              <div className="min-w-0">
                <h2 className="font-extrabold text-slate-900">
                  Address Information
                </h2>
                <p className="text-xs leading-5 text-slate-500">
                  Your business location
                </p>
              </div>
            </div>

            <SectionActions
              section="address"
              editing={editing}
              saving={saving}
              onEdit={startEditing}
              onCancel={cancelEditing}
            />
          </div>

          <form id="profile-address" onSubmit={saveProfile}>
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <div className="min-w-0 sm:col-span-2">
                <ProfileField
                  label="Complete Address"
                  value={profile.address}
                  field="address"
                  placeholder="Building, street, area..."
                  editing={editing}
                  form={form}
                  onChange={updateField}
                />
              </div>

              <ProfileField
                label="City"
                value={profile.city}
                field="city"
                editing={editing}
                form={form}
                onChange={updateField}
              />

              <ProfileField
                label="State"
                value={profile.state}
                field="state"
                editing={editing}
                form={form}
                onChange={updateField}
              />

              <ProfileField
                label="PIN Code"
                value={profile.pincode}
                field="pincode"
                placeholder="Enter PIN code"
                editing={editing}
                form={form}
                onChange={updateField}
              />
            </div>
          </form>
        </section>

        {/* ACCOUNT VERIFICATION */}
        <section className="profile-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
          <div className="mb-5 flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={21} />
            </div>
            <div className="min-w-0">
              <h2 className="font-extrabold text-slate-900">
                Account Verification
              </h2>
              <p className="text-xs leading-5 text-slate-500">
                Your contact verification status
              </p>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Mail size={20} className="shrink-0 text-slate-500" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800">
                    Email Verification
                  </p>
                  <p className="break-all text-xs text-slate-400">
                    {profile.email}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                  profile.isEmailVerified
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {profile.isEmailVerified ? "Verified" : "Pending"}
              </span>
            </div>

            <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Phone size={20} className="shrink-0 text-slate-500" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800">
                    Phone Verification
                  </p>
                  <p className="break-words text-xs text-slate-400">
                    {profile.phone || "No phone number"}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                  profile.isPhoneVerified
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {profile.isPhoneVerified ? "Verified" : "Pending"}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400">
            OTP verification will be required to verify your email and phone
            number.
          </p>
        </section>

        {/* SECURITY */}
        <section className="profile-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <LockKeyhole size={21} />
              </div>
              <div className="min-w-0">
                <h2 className="font-extrabold text-slate-900">
                  Account Security
                </h2>
                <p className="text-xs leading-5 text-slate-500">
                  Keep your account password secure
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowPasswordForm((previous) => !previous);
                setError("");
                setSuccess("");
              }}
              className="w-full shrink-0 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100 sm:w-auto"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showPasswordForm && (
            <form
              onSubmit={changePassword}
              className="mt-6 space-y-5 border-t border-slate-100 pt-6"
            >
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {/* CURRENT PASSWORD */}
                <div className="min-w-0 space-y-2 sm:col-span-2">
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
                        setPasswords((previous) => ({
                          ...previous,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter current password"
                      className="profile-input w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword((previous) => !previous)
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

                {/* NEW PASSWORD */}
                <div className="min-w-0 space-y-2">
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
                        setPasswords((previous) => ({
                          ...previous,
                          newPassword: e.target.value,
                        }))
                      }
                      placeholder="Minimum 8 characters"
                      className="profile-input w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword((previous) => !previous)
                      }
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

                {/* CONFIRM PASSWORD */}
                <div className="min-w-0 space-y-2">
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
                      setPasswords((previous) => ({
                        ...previous,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm new password"
                    className="profile-input w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60 sm:w-auto"
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

        {/* FOOTER */}
        <footer className="flex min-w-0 flex-col gap-3 pb-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Advixio360 Supplier Account Management</p>

          <Link
            href="/dashboard"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Return to Dashboard
          </Link>
        </footer>
      </div>
    </main>
  );
}