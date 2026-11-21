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

type ProfileFieldProps = {
  label: string;
  value?: string;
  field?: keyof Profile;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
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
  fullWidth = false,
  editing,
  form,
  onChange,
}: ProfileFieldProps) {
  const isEditing = editing !== null && !disabled && field !== undefined;

  return (
    <div className={`sd-field${fullWidth ? " full" : ""}`}>
      <label>{label}</label>

      {isEditing ? (
        multiline ? (
          <textarea
            value={String(form[field] ?? "")}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            rows={4}
            maxLength={field === "businessDescription" ? 1000 : undefined}
          />
        ) : (
          <input
            type={type}
            value={String(form[field] ?? "")}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            maxLength={field === "name" ? 100 : undefined}
          />
        )
      ) : (
        <div className={`sd-field-display${value ? "" : " muted"}`}>
          <span className={value ? "" : "sd-placeholder"}>
            {value || "Not provided"}
          </span>
        </div>
      )}
    </div>
  );
}

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
        className="sd-btn"
      >
        <Pencil size={14} />
        Edit
      </button>
    );
  }

  return (
    <div className="sd-actions">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="sd-btn"
      >
        <X size={14} />
        Cancel
      </button>

      <button
        type="submit"
        form={`profile-${section}`}
        disabled={saving}
        className="sd-btn sd-btn-primary"
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

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
        headers: { Authorization: `Bearer ${currentToken}` },
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
      setForm({ ...emptyProfile, ...user });
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
          profileImage: user.profileImage,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (field: keyof Profile, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
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
      setForm({ ...emptyProfile, ...updatedProfile });
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
          profileImage: updatedProfile.profileImage,
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

      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
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

  const initials = (profile.companyName || profile.name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const completionFields = [
    profile.name,
    profile.email,
    profile.phone,
    profile.companyName,
    profile.businessType,
    profile.gstNumber,
    profile.businessDescription,
    profile.address,
    profile.city,
    profile.state,
    profile.pincode,
    profile.profileImage,
  ];
  const completion = Math.round(
    (completionFields.filter((v) => v && String(v).trim()).length /
      completionFields.length) *
      100
  );

  const businessSubtitle = [
    profile.businessType || "Supplier",
    profile.city && profile.state ? `${profile.city}, ${profile.state}` : profile.city || profile.state,
  ]
    .filter(Boolean)
    .join(" • ");

  if (loading) {
    return (
      <div className="sd-loading" style={{ padding: "48px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Loader2 size={32} className="animate-spin" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sd-page-head">
        <div>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              color: "var(--sd-muted)",
              marginBottom: 6,
            }}
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
          <h1>Business Profile</h1>
          <p>Manage the public information buyers see about your company.</p>
        </div>
        <div className="sd-actions">
          <button onClick={loadProfile} type="button" className="sd-btn">
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="sd-alert error">
          <AlertCircle size={16} style={{ marginTop: 1, flex: "none" }} />
          <span style={{ minWidth: 0, wordBreak: "break-word" }}>{error}</span>
        </div>
      )}

      {success && (
        <div className="sd-alert success">
          <CheckCircle2 size={16} style={{ marginTop: 1, flex: "none" }} />
          <span style={{ minWidth: 0, wordBreak: "break-word" }}>{success}</span>
        </div>
      )}

      <div className="sd-form-layout">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="sd-card" style={{ marginBottom: 0 }}>
            <div className="sd-profile-editor">
              <div className="sd-company-logo-large">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" />
                ) : (
                  initials
                )}
              </div>
              <div className="sd-editor-meta">
                <h2>{profile.companyName || profile.name || "Your Business"}</h2>
                <p>{businessSubtitle}</p>
                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <label
                    htmlFor="profile-image"
                    className="sd-btn"
                    style={{ cursor: "pointer", margin: 0 }}
                  >
                    Change Logo
                  </label>
                  {profileImage && (
                    <span className="sd-muted-note">New image selected — save Personal Information to upload.</span>
                  )}
                </div>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    handleImageChange(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
            <div className="sd-form-grid no-top" style={{ marginTop: 18 }}>
              <div className="sd-field">
                <label>Email Address</label>
                <div className="sd-field-display">
                  <span>{profile.email || "Not provided"}</span>
                </div>
              </div>
              <div className="sd-field">
                <label>Phone Number</label>
                <div className={`sd-field-display${profile.phone ? "" : " muted"}`}>
                  <span className={profile.phone ? "" : "sd-placeholder"}>
                    {profile.phone || "Not provided"}
                  </span>
                </div>
              </div>
              <div className="sd-field full">
                <label>Location</label>
                <div className={`sd-field-display${profile.city || profile.state ? "" : " muted"}`}>
                  <span className={profile.city || profile.state ? "" : "sd-placeholder"}>
                    {[profile.city, profile.state].filter(Boolean).join(", ") || "Not provided"}
                  </span>
                </div>
              </div>
            </div>
            <p className="sd-inline-help">
              Contact details and logo can be updated in the Personal Information section below.
            </p>
          </section>

          <section className="sd-card" style={{ marginBottom: 0 }}>
            <div className="sd-section-head">
              <div className="sd-section-head-left">
                <div className="sd-section-icon">
                  <UserRound size={18} />
                </div>
                <div>
                  <h2>Personal Information</h2>
                  <p>Your basic account information</p>
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
              <div className="sd-form-grid">
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
              <p className="sd-inline-help">
                Email address cannot be edited here. Email changes require verification.
              </p>
            </form>
          </section>

          <section className="sd-card" style={{ marginBottom: 0 }}>
            <div className="sd-section-head">
              <div className="sd-section-head-left">
                <div className="sd-section-icon violet">
                  <Building2 size={18} />
                </div>
                <div>
                  <h2>Business Information</h2>
                  <p>Your company and business details</p>
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
              <div className="sd-form-grid">
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
                <ProfileField
                  label="Business Description"
                  value={profile.businessDescription}
                  field="businessDescription"
                  multiline
                  fullWidth
                  placeholder="Describe your company and products..."
                  editing={editing}
                  form={form}
                  onChange={updateField}
                />
              </div>
            </form>
          </section>

          <section className="sd-card" style={{ marginBottom: 0 }}>
            <div className="sd-section-head">
              <div className="sd-section-head-left">
                <div className="sd-section-icon green">
                  <MapPin size={18} />
                </div>
                <div>
                  <h2>Address Information</h2>
                  <p>Your business location</p>
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
              <div className="sd-form-grid">
                <ProfileField
                  label="Complete Address"
                  value={profile.address}
                  field="address"
                  fullWidth
                  placeholder="Building, street, area..."
                  editing={editing}
                  form={form}
                  onChange={updateField}
                />
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

          <section className="sd-card" style={{ marginBottom: 0 }}>
            <div className="sd-section-head" style={{ marginBottom: 14 }}>
              <div className="sd-section-head-left">
                <div className="sd-section-icon amber">
                  <LockKeyhole size={18} />
                </div>
                <div>
                  <h2>Account Security</h2>
                  <p>Keep your account password secure</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm((previous) => !previous);
                  setError("");
                  setSuccess("");
                }}
                className="sd-btn"
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={changePassword} style={{ borderTop: "1px solid var(--sd-border)", paddingTop: 18 }}>
                <div className="sd-form-grid no-top">
                  <div className="sd-field full">
                    <label>Current Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        required
                        type={showCurrentPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={passwords.currentPassword}
                        onChange={(e) =>
                          setPasswords((p) => ({ ...p, currentPassword: e.target.value }))
                        }
                        placeholder="Enter current password"
                        style={{ paddingRight: 40 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((p) => !p)}
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          border: 0,
                          background: "transparent",
                          color: "var(--sd-muted)",
                          padding: 4,
                        }}
                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="sd-field">
                    <label>New Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        required
                        minLength={8}
                        type={showNewPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords((p) => ({ ...p, newPassword: e.target.value }))
                        }
                        placeholder="Minimum 8 characters"
                        style={{ paddingRight: 40 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((p) => !p)}
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          border: 0,
                          background: "transparent",
                          color: "var(--sd-muted)",
                          padding: 4,
                        }}
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="sd-field">
                    <label>Confirm New Password</label>
                    <input
                      required
                      minLength={8}
                      type="password"
                      autoComplete="new-password"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))
                      }
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="sd-btn sd-btn-primary"
                  >
                    {changingPassword ? <Loader2 size={14} className="animate-spin" /> : <LockKeyhole size={14} />}
                    {changingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="sd-card" style={{ marginBottom: 0 }}>
            <div className="sd-card-head" style={{ marginBottom: 8 }}>
              <div>
                <h2>Profile Completion</h2>
              </div>
            </div>
            <div className="sd-big-progress">
              <b>{completion}%</b>
              <div className="sd-progress-track">
                <i style={{ width: `${completion}%` }} />
              </div>
            </div>
            <p className="sd-muted-note">
              {completion >= 100
                ? "Your business profile is complete."
                : "Add missing company, contact, and address details to improve buyer confidence."}
            </p>
          </section>

          <section className="sd-card" style={{ marginBottom: 0 }}>
            <div className="sd-card-head" style={{ marginBottom: 8 }}>
              <div>
                <h2>Verification</h2>
                <p>Account trust signals</p>
              </div>
            </div>
            <div>
              <div className="sd-verify-large">
                <div className={`sd-verify-icon${profile.isEmailVerified ? "" : " pending"}`}>
                  <ShieldCheck size={12} />
                </div>
                <div className="sd-verify-large-body">
                  <h3>Email Verification</h3>
                  <p>{profile.email || "No email address"}</p>
                </div>
                <span className={`sd-status ${profile.isEmailVerified ? "published" : "pending"}`}>
                  {profile.isEmailVerified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="sd-verify-large">
                <div className={`sd-verify-icon${profile.isPhoneVerified ? "" : " pending"}`}>
                  <ShieldCheck size={12} />
                </div>
                <div className="sd-verify-large-body">
                  <h3>Phone Verification</h3>
                  <p>{profile.phone || "No phone number"}</p>
                </div>
                <span className={`sd-status ${profile.isPhoneVerified ? "published" : "pending"}`}>
                  {profile.isPhoneVerified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="sd-verify-large">
                <div className={`sd-verify-icon${profile.companyName && profile.businessType ? "" : " pending"}`}>
                  <ShieldCheck size={12} />
                </div>
                <div className="sd-verify-large-body">
                  <h3>Business Details</h3>
                  <p>{profile.companyName && profile.businessType ? "Company information added" : "Add company name and type"}</p>
                </div>
                <span className={`sd-status ${profile.companyName && profile.businessType ? "published" : "pending"}`}>
                  {profile.companyName && profile.businessType ? "Added" : "Pending"}
                </span>
              </div>
              <div className="sd-verify-large">
                <div className={`sd-verify-icon${profile.address && profile.city && profile.state ? "" : " pending"}`}>
                  <ShieldCheck size={12} />
                </div>
                <div className="sd-verify-large-body">
                  <h3>Address Details</h3>
                  <p>{profile.address && profile.city && profile.state ? "Business location added" : "Add business address"}</p>
                </div>
                <span className={`sd-status ${profile.address && profile.city && profile.state ? "published" : "pending"}`}>
                  {profile.address && profile.city && profile.state ? "Added" : "Pending"}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
