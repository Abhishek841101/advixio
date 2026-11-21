import Link from "next/link";

export default function DashboardSettingsPage() {
  return (
    <>
      <div className="sd-page-head">
        <div>
          <h1>Settings</h1>
          <p>Manage your account preferences and supplier settings.</p>
        </div>
        <div className="sd-actions">
          <Link href="/dashboard/profile" className="sd-btn sd-btn-primary">
            Edit Profile
          </Link>
        </div>
      </div>

      <section className="sd-card">
        <div className="sd-card-head">
          <div>
            <h2>Account Settings</h2>
            <p>Quick access to common settings</p>
          </div>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <div className="sd-verify" style={{ borderBottom: "1px solid #BFDBFE" }}>
            <div className="sd-verify-icon">👤</div>
            <div style={{ flex: 1 }}>
              <strong>Profile & Business Details</strong>
              <span>Update personal, business, and address information</span>
            </div>
            <Link href="/dashboard/profile" className="sd-link">
              Open
            </Link>
          </div>
          <div className="sd-verify" style={{ borderBottom: "1px solid #BFDBFE" }}>
            <div className="sd-verify-icon">🔒</div>
            <div style={{ flex: 1 }}>
              <strong>Security</strong>
              <span>Change your account password from the profile page</span>
            </div>
            <Link href="/dashboard/profile" className="sd-link">
              Manage
            </Link>
          </div>
          <div className="sd-verify">
            <div className="sd-verify-icon">📦</div>
            <div style={{ flex: 1 }}>
              <strong>Product Listings</strong>
              <span>Add, edit, or remove your products</span>
            </div>
            <Link href="/dashboard/products" className="sd-link">
              View
            </Link>
          </div>
        </div>
      </section>

      <section className="sd-card">
        <div className="sd-card-head">
          <div>
            <h2>Notifications & Preferences</h2>
            <p>More options coming soon</p>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: "var(--sd-muted)" }}>
          Advanced notification, visibility, and account preference controls will
          be available here in a future update.
        </p>
      </section>
    </>
  );
}