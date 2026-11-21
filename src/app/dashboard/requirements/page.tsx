import Link from "next/link";

export default function DashboardRequirementsPage() {
  return (
    <>
      <div className="sd-page-head">
        <div>
          <h1>My Requirements</h1>
          <p>Buyer requirements and opportunities relevant to your business.</p>
        </div>
        <div className="sd-actions">
          <Link href="/dashboard" className="sd-btn">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <section className="sd-card">
        <div className="sd-card-head">
          <div>
            <h2>Requirements</h2>
            <p>Stay updated on buyer requests</p>
          </div>
        </div>
        <div className="sd-empty" style={{ textAlign: "left", padding: 0 }}>
          <p style={{ margin: 0, color: "var(--sd-text)", fontWeight: 700 }}>
            Requirements are coming soon.
          </p>
          <p style={{ margin: "6px 0 0", color: "var(--sd-muted)" }}>
            You&apos;ll be able to view and respond to buyer requirements that match
            your products here. In the meantime, keep your catalog and profile up
            to date.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <Link href="/dashboard/products" className="sd-btn sd-btn-primary">
              Manage Products
            </Link>
            <Link href="/dashboard/profile" className="sd-btn">
              Update Profile
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}