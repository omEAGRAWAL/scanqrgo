import React, { useEffect, useState } from "react";
import { API_URL } from "../config/api";
import {
  PencilSquareIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/userall`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update subscription
  const updateSubscription = async (id, status) => {
    try {
      const body = { status };

      if (status === "active") {
        body.activeUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 days
      }

      const res = await fetch(`${API_URL}/admin/users/${id}/subscription`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to update subscription");

      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading users...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        👤 Admin Panel — Manage User Subscriptions
      </h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Free Trial End
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Active Until
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">{u.email}</td>
                <td className="px-6 py-4 text-sm">{u.role}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      u.subscription?.status === "active"
                        ? "bg-green-100 text-green-700"
                        : u.subscription?.status === "freeTrial"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.subscription?.status || "none"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {u.subscription?.freeTrialEnd
                    ? new Date(u.subscription.freeTrialEnd).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {u.subscription?.activeUntil
                    ? new Date(u.subscription.activeUntil).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-6 py-4 flex justify-center space-x-2">
                  <button
                    onClick={() => updateSubscription(u._id, "freeTrial")}
                    className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs px-3 py-1 rounded-full"
                  >
                    <ClockIcon className="h-4 w-4" /> Trial
                  </button>
                  <button
                    onClick={() => updateSubscription(u._id, "active")}
                    className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs px-3 py-1 rounded-full"
                  >
                    <CheckCircleIcon className="h-4 w-4" /> Active
                  </button>
                  <button
                    onClick={() => updateSubscription(u._id, "expired")}
                    className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs px-3 py-1 rounded-full"
                  >
                    <XCircleIcon className="h-4 w-4" /> Expire
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
