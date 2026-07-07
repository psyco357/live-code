"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";

interface FormErrors {
  name?: string;
  company?: string;
  email?: string;
}

export default function NewLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ── Validasi per field ──────────────────────────────
  function validateField(field: string, value: string): string | undefined {
    switch (field) {
      case "name":
        if (!value.trim()) return "Nama wajib diisi";
        if (value.trim().length < 2) return "Nama minimal 2 karakter";
        return undefined;

      case "company":
        if (!value.trim()) return "Perusahaan wajib diisi";
        return undefined;

      case "email":
        if (!value.trim()) return "Email wajib diisi";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Format email tidak valid";
        return undefined;

      default:
        return undefined;
    }
  }

  // ── Validasi semua field ────────────────────────────
  function validateAll(): FormErrors {
    const newErrors: FormErrors = {};
    for (const key of Object.keys(form) as (keyof typeof form)[]) {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    }
    return newErrors;
  }

  // ── Handler perubahan input ─────────────────────────
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validasi real-time jika field sudah pernah disentuh
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  }

  // ── Handler blur ────────────────────────────────────
  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  }

  // ── Submit ──────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Tandai semua field sebagai touched
    setTouched({ name: true, company: true, email: true });

    const newErrors = validateAll();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert("Gagal menyimpan data. Silakan coba lagi.");
        return;
      }

      router.push("/leads");
      router.refresh();
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }

  // ── Helper class untuk input ────────────────────────
  function inputClass(field: keyof FormErrors) {
    const hasError = touched[field] && errors[field];
    return [
      "w-full rounded-lg border px-4 py-2.5 text-sm",
      "outline-none transition-all duration-200",
      "placeholder:text-gray-400",
      "focus:ring-2 focus:ring-offset-1",
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-300"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-300",
    ].join(" ");
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8 sm:px-6">
      {/* ── Tombol Kembali ─────────────────────────── */}
      <button
        type="button"
        onClick={() => router.push("/leads")}
        className="mb-6 inline-flex items-center gap-1.5
                   text-sm text-gray-500 hover:text-gray-900
                   transition-colors"
      >
          ← Back
      </button>

      {/* ── Header ─────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Tambah Lead Baru
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Isi formulir di bawah untuk menambahkan lead baru.
        </p>
      </div>

      {/* ── Form ───────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Masukkan nama lengkap"
            className={inputClass("name")}
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.name && errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label
            htmlFor="company"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Perusahaan <span className="text-red-500">*</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Masukkan nama perusahaan"
            className={inputClass("company")}
            value={form.company}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.company && errors.company && (
            <p className="mt-1 text-xs text-red-500">{errors.company}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="contoh@perusahaan.com"
            className={inputClass("email")}
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* ── Action Buttons ───────────────────────── */}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/leads")}
            className="rounded-lg border border-gray-300 px-5 py-2.5
                       text-sm font-medium text-gray-700
                       hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5
                       text-sm font-medium text-white
                       hover:bg-blue-700 transition-colors
                       disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                  />
                  <path
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    fill="currentColor"
                    className="opacity-75"
                  />
                </svg>
                Menyimpan…
              </span>
            ) : (
              "Simpan Lead"
            )}
          </button>
        </div>
      </form>
    </main>
  );
}