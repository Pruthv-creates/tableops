"use client";

import { useState } from "react";
import { RestaurantTable } from "../types";
import { useTableStore } from "../store/table.store";
import { X, User, Phone, CalendarDays, Clock, AlertCircle } from "lucide-react";

interface Props {
  table: RestaurantTable;
  onClose: () => void;
}

function to12h(time24: string): string {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

const todayISO = new Date().toISOString().split("T")[0];

interface InputFieldProps {
  fkey: string;
  label: string;
  Icon: React.ElementType;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

const InputField = ({
  fkey,
  label,
  Icon,
  value,
  onChange,
  error,
  inputProps,
}: InputFieldProps) => (
  <div>
    <label
      htmlFor={fkey}
      className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2"
    >
      {label}
    </label>
    <div className="relative">
      <Icon
        size={14}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        id={fkey}
        {...inputProps}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-white/5 placeholder:text-slate-400 outline-none transition focus:ring-2 ${
          error
            ? "border-rose-400 focus:ring-rose-400/30"
            : "border-slate-200 dark:border-white/10 focus:ring-indigo-500/30"
        }`}
      />
    </div>
    {error && (
      <p className="text-[11px] text-rose-500 mt-1">{error}</p>
    )}
  </div>
);

export function BookTableModal({ table, onClose }: Props) {
  const { bookTable } = useTableStore();

  const [form, setForm] = useState({
    guestName: "",
    mobile: "",
    date: todayISO,
    time: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<typeof form>>({});
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof form, val: string) => {
    let finalVal = val;
    
    // Prevent typing numbers or special characters in the name field
    if (key === "guestName") {
      finalVal = val.replace(/[^A-Za-z\s.'-]/g, "");
    }
    
    setForm((p) => ({ ...p, [key]: finalVal }));
    setFieldErrors((p) => ({ ...p, [key]: undefined }));
    setConflictError(null);
  };

  const validate = () => {
    const e: Partial<typeof form> = {};
    
    if (!form.guestName.trim()) {
      e.guestName = "Name is required";
    } else if (!/^[A-Za-z\s.'-]+$/.test(form.guestName.trim())) {
      e.guestName = "Only letters, spaces, and .'- are allowed";
    }

    if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile";
    if (!form.date) e.date = "Pick a date";
    if (!form.time) e.time = "Pick a time";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const error = bookTable(table.id, table.restaurantSlug, {
      guestName: form.guestName.trim(),
      mobile: form.mobile,
      date: form.date,
      time: form.time,
    });

    if (error) {
      setConflictError(error);
      setSubmitting(false);
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-[420px] h-full bg-white dark:bg-[#0f172a] shadow-2xl border-l border-slate-200 dark:border-white/10 flex flex-col animate-in slide-in-from-right duration-300 ease-out">
        {/* Gradient Header Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Book {table.name}
                </h2>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    Capacity: {table.capacity} guests
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-all hover:rotate-90 active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="space-y-5">
                <InputField
                  fkey="guestName"
                  label="Guest Name"
                  Icon={User}
                  value={form.guestName}
                  onChange={(val) => set("guestName", val)}
                  error={fieldErrors.guestName}
                  inputProps={{ type: "text", placeholder: "e.g. Riya Sharma", autoFocus: true }}
                />

                <InputField
                  fkey="mobile"
                  label="Mobile Number"
                  Icon={Phone}
                  value={form.mobile}
                  onChange={(val) => set("mobile", val)}
                  error={fieldErrors.mobile}
                  inputProps={{ type: "tel", placeholder: "10-digit number", maxLength: 10 }}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    fkey="date"
                    label="Date"
                    Icon={CalendarDays}
                    value={form.date}
                    onChange={(val) => set("date", val)}
                    error={fieldErrors.date}
                    inputProps={{ type: "date", min: todayISO }}
                  />
                  <InputField
                    fkey="time"
                    label="Time"
                    Icon={Clock}
                    value={form.time}
                    onChange={(val) => set("time", val)}
                    error={fieldErrors.time}
                    inputProps={{ type: "time" }}
                  />
                </div>
              </div>

              {/* Time preview */}
              {form.time && !conflictError && (
                <div className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl border border-indigo-200/50 dark:border-indigo-500/20" />
                  <div className="relative px-4 py-4 flex items-center gap-3 text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-xs opacity-70 mb-0.5">Selected Slot</p>
                      <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                        {to12h(form.time)}
                        {form.date && (
                          <span className="font-medium opacity-60">
                            &bull; {new Date(form.date + "T00:00:00").toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Conflict / overlap error banner */}
              {conflictError && (
                <div className="flex items-start gap-3 bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 rounded-2xl px-5 py-5 text-sm text-rose-700 dark:text-rose-300 animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Booking Conflict</p>
                    <p className="opacity-90 leading-relaxed">{conflictError}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sticky Footer Action */}
        <div className="p-8 bg-slate-50/50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] group"
          >
            <span className="flex items-center justify-center gap-2">
              {submitting ? "Processing..." : "Confirm Reservation"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
