
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  city?: string;
  state?: string;
  isActive: boolean;
  isSupplier: boolean;
  activeProductCount: number;
  createdAt?: string;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type UserForm = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  city: string;
  state: string;
};

const emptyForm: UserForm = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  city: "",
  state: "",
};

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("advixio_admin_token");
  };

  const fetchUsers = useCallback(async () => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        type,
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(
        `${API_URL}/admin/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("advixio_admin_token");
        localStorage.removeItem("advixio_admin");
        router.replace("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load users.");
      }

      setUsers(result.data || []);
      setPagination((previous) => ({
        ...previous,
        ...(result.pagination || {}),
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, type, search, router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      companyName: user.companyName || "",
      city: user.city || "",
      state: user.state || "",
    });
    setMessage("");
  };

  const closeEdit = () => {
    if (saving) return;
    setSelectedUser(null);
    setForm(emptyForm);
  };

  const handleFormChange = (
    field: keyof UserForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const saveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedUser) return;

    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/admin/users/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("advixio_admin_token");
        localStorage.removeItem("advixio_admin");
        router.replace("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to update user.");
      }

      setSelectedUser(null);
      setMessage("User details updated successfully.");
      await fetchUsers();
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user: User) => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const action = user.isActive ? "deactivate" : "activate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} ${user.name}'s account?`
      )
    ) {
      return;
    }

    setUpdatingId(user._id);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/admin/users/${user._id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !user.isActive,
          }),
        }
      );

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("advixio_admin_token");
        localStorage.removeItem("advixio_admin");
        router.replace("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to update status.");
      }

      setMessage(result.message || "Account status updated.");
      await fetchUsers();
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Status update failed."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const changePage = (page: number) => {
    setPagination((previous) => ({
      ...previous,
      page,
    }));
  };

  const changeType = (value: string) => {
    setType(value);
    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-slate-800">

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
              User Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage registered buyers and suppliers.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            ↻ Refresh
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] p-5 sm:p-8">

        {/* Summary */}
        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              {type === "all"
                ? "Total Users"
                : type === "supplier"
                ? "Total Suppliers"
                : "Total Buyers"}
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
              {pagination.total}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Users on This Page
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-indigo-600">
              {users.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Current Page
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
              {pagination.page}
              <span className="text-lg font-semibold text-slate-400">
                {" "}/ {pagination.totalPages || 1}
              </span>
            </h2>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All Users" },
                { value: "supplier", label: "Suppliers" },
                { value: "buyer", label: "Buyers" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => changeType(item.value)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    type === item.value
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex w-full gap-2 lg:max-w-md">
              <input
                type="search"
                value={search}
                onChange={(event) => changeSearch(event.target.value)}
                placeholder="Search name, email, phone, company..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                onClick={fetchUsers}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Message */}
        {message && (
          <div className="mb-5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Users Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-bold text-slate-900">
                Registered Accounts
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                User information and account controls
              </p>
            </div>

            <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
              {pagination.total} Records
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                <p className="mt-3 text-sm text-slate-500">
                  Loading users...
                </p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="px-5 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
                ♙
              </div>

              <h3 className="mt-4 font-bold text-slate-800">
                No users found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try another search or select a different category.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-bold">User</th>
                    <th className="px-5 py-4 font-bold">Contact</th>
                    <th className="px-5 py-4 font-bold">Account Type</th>
                    <th className="px-5 py-4 font-bold">Products</th>
                    <th className="px-5 py-4 font-bold">Joined</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold uppercase text-indigo-700">
                            {user.name?.charAt(0) || "U"}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[180px] truncate text-sm font-bold text-slate-800">
                              {user.name}
                            </p>
                            <p className="mt-1 max-w-[180px] truncate text-xs text-slate-400">
                              {user.companyName || "No company"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {user.email}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {user.phone || "No phone"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {user.isSupplier ? (
                          <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
                            Supplier
                          </span>
                        ) : (
                          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                            Buyer
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-slate-700">
                          {user.activeProductCount || 0}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        {user.isActive ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(user)}
                            className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => toggleStatus(user)}
                            disabled={updatingId === user._id}
                            className={`rounded-lg px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${
                              user.isActive
                                ? "border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                                : "border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {updatingId === user._id
                              ? "Please wait..."
                              : user.isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && users.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-5 py-4">
              <p className="text-xs text-slate-500">
                Showing{" "}
                {(pagination.page - 1) * pagination.limit + 1}
                {" "}to{" "}
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.total
                )}
                {" "}of {pagination.total} users
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => changePage(pagination.page - 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="px-2 text-sm font-bold text-slate-700">
                  {pagination.page} / {pagination.totalPages || 1}
                </span>

                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => changePage(pagination.page + 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="py-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Advixio360 · Super Admin
        </footer>
      </main>

      {/* Edit User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Edit User
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Update user and company information.
                </p>
              </div>

              <button
                onClick={closeEdit}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xl text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveUser} className="p-6">

              <div className="grid gap-5 sm:grid-cols-2">
                {(
                  [
                    ["name", "Full Name"],
                    ["email", "Email Address"],
                    ["phone", "Phone Number"],
                    ["companyName", "Company Name"],
                    ["city", "City"],
                    ["state", "State"],
                  ] as [keyof UserForm, string][]
                ).map(([field, label]) => (
                  <div key={field}>
                    <label className="mb-2 block text-xs font-bold text-slate-600">
                      {label}
                      {field === "name" || field === "email" ? (
                        <span className="text-red-500"> *</span>
                      ) : null}
                    </label>

                    <input
                      type={field === "email" ? "email" : "text"}
                      required={field === "name" || field === "email"}
                      value={form[field]}
                      onChange={(event) =>
                        handleFormChange(field, event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">
                Note: Changing the user's name or company name may change
                their current public supplier URL because the existing
                supplier slug is generated dynamically.
              </div>

              <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
