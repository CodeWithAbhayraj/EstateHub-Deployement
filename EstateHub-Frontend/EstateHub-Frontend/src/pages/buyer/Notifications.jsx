
import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};


export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = async (showFullLoader = true) => {
    try {
      if (showFullLoader) setLoading(true);
      else setRefreshing(true);

      setError("");

      const data = await getMyNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load notifications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleRefresh = async () => loadNotifications(false);

  const handleMarkAsRead = async (id) => {
    try {
      setActionLoading(id);

      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to mark notification as read."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkAllLoading(true);

      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to mark all as read."
      );
    } finally {
      setMarkAllLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatType = (type) =>
    type
      ? type.replace(/_/g, " ")
      : "NOTIFICATION";

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const getTypeAccent = (type) => {
    const value = String(type || "").toUpperCase();

    if (value.includes("LEAD")) {
      return {
        icon: "bg-[#F4EBD7] text-[#8C6924]",
        label: "text-[#8C6924]",
      };
    }

    if (value.includes("VISIT")) {
      return {
        icon: "bg-[#EEF3F7] text-[#4C6578]",
        label: "text-[#4C6578]",
      };
    }

    if (value.includes("PROPERTY")) {
      return {
        icon: "bg-[#EDF4EE] text-[#3F6B52]",
        label: "text-[#3F6B52]",
      };
    }

    return {
      icon: "bg-[#F4EDE4] text-[#8A806D]",
      label: "text-[#6B6252]",
    };
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-[#F8F5ED] px-4 py-10">
        <div className="mx-auto flex min-h-[50vh] max-w-4xl items-center justify-center">
          <div className="text-center">
            <div className="relative mx-auto h-12 w-12">
              <div className="absolute inset-0 rounded-full border border-[#D8CFB9]" />
              <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-[#AD8332]" />
            </div>

            <p className="mt-5 text-sm font-medium tracking-wide text-[#8A806D]">
              Loading notifications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8F5ED] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">

        {/* Header */}
        <div className="relative mb-7 overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1]">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(173,131,50,0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(173,131,50,0.08) 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#D8C18F] bg-[#F4EBD7] text-[#8C6924]">
                <Bell size={22} strokeWidth={1.7} />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-px w-7 bg-[#AD8332]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#AD8332]">
                    Activity
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <h1
                    style={FRASER}
                    className="text-3xl font-semibold tracking-tight text-[#201C15] sm:text-4xl"
                  >
                    Notifications
                  </h1>

                  {unreadCount > 0 && (
                    <span className="rounded-full border border-[#D8C18F] bg-[#F4EBD7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8C6924]">
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                <p className="mt-1.5 text-sm text-[#8A806D]">
                  Stay updated about your EstateHub activities.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D8CFB9] bg-[#FBF8F1] px-4 py-2.5 text-sm font-semibold text-[#3B352A] transition hover:border-[#BFA568] hover:bg-[#F4EBD7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markAllLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#201C15] px-4 py-2.5 text-sm font-semibold text-[#FBF8F1] transition hover:bg-[#302A21] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCheck size={15} />
                  {markAllLoading
                    ? "Updating..."
                    : "Mark all read"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#E4C4BE] bg-[#FAEFEC] p-4 text-sm text-[#9D4B42]">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#B3564B]" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1] p-8 text-center sm:p-12">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(173,131,50,0.07) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(173,131,50,0.07) 1px, transparent 1px)
                `,
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative mx-auto flex max-w-md flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D8C18F] bg-[#F4EBD7] text-[#AD8332]">
                <Bell size={28} strokeWidth={1.5} />
              </div>

              <h3
                style={FRASER}
                className="mt-5 text-2xl font-semibold text-[#201C15]"
              >
                No notifications
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8A806D]">
                New activity and updates will appear here.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Activity Summary */}
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A806D]">
                Recent activity
              </span>

              <span className="rounded-full border border-[#D8CFB9] bg-[#FBF8F1] px-2.5 py-1 text-xs font-semibold text-[#6B6252]">
                {notifications.length} total
              </span>

              {unreadCount > 0 && (
                <span className="rounded-full border border-[#D8C18F] bg-[#F4EBD7] px-2.5 py-1 text-xs font-bold text-[#8C6924]">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {/* Notifications */}
            <div className="space-y-3">
              {notifications.map((n) => {
                const unread = !n.isRead;
                const accent = getTypeAccent(n.type);

                return (
                  <div
                    key={n.id}
                    className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition duration-200 hover:shadow-[0_10px_28px_rgba(49,42,29,0.06)] ${
                      unread
                        ? "border-[#D8C18F] bg-[#FBF8F1]"
                        : "border-[#D8CFB9] bg-[#FBF8F1]"
                    }`}
                  >
                    {/* Unread accent */}
                    {unread && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-[#AD8332]" />
                    )}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3.5">
                        {/* Icon */}
                        <div
                          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            unread
                              ? accent.icon
                              : "bg-[#F5F1E8] text-[#8A806D]"
                          }`}
                        >
                          <Bell size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          {/* Type */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                                unread
                                  ? accent.label
                                  : "text-[#8A806D]"
                              }`}
                            >
                              {formatType(n.type)}
                            </span>

                            {unread && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#201C15] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#FBF8F1]">
                                <Sparkles size={9} />
                                New
                              </span>
                            )}
                          </div>

                          {/* Message */}
                          <p
                            className={`mt-2 text-sm leading-6 ${
                              unread
                                ? "font-semibold text-[#302A21]"
                                : "font-medium text-[#6B6252]"
                            }`}
                          >
                            {n.message ||
                              "You have a new notification."}
                          </p>

                          {/* Date */}
                          {n.createdAt && (
                            <p className="mt-2 text-xs text-[#9A917F]">
                              {formatDate(n.createdAt)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Mark Read */}
                      {unread && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          disabled={actionLoading === n.id}
                          className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-lg border border-[#D8CFB9] bg-[#FBF8F1] px-3 py-2 text-xs font-semibold text-[#6B6252] transition hover:border-[#BFA568] hover:bg-[#F4EBD7] hover:text-[#8C6924] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Check size={14} />
                          {actionLoading === n.id
                            ? "Updating..."
                            : "Mark read"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* All Caught Up */}
            {unreadCount === 0 && notifications.length > 0 && (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#BFD2C2] bg-[#EDF4EE] p-3.5 text-sm font-semibold text-[#3F6B52]">
                <CheckCheck size={17} />
                You're all caught up.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

