"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Hash, MailCheck, UserIcon as UserRoundIcon } from "lucide-react";
import { isValidEmail } from "@/lib/auth/password";
import { MailIcon, UserIcon } from "@/components/auth/auth-icons";
import { TextField } from "@/components/auth/auth-field";
import { api } from "@/lib/api/client";

const INITIAL_FORM = {
  email: "",
  nomorInduk: "",
  tanggalLahir: "",
  agree: false,
};

/**
 * Self-service student registration. The backend matches `nomor_induk` and
 * `tanggal_lahir` against the roster imported by the admin, then sends an
 * activation link to `email` — the password is created on that link, not here.
 */
export function RegisterForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const email = form.email.trim();
    const nomorInduk = form.nomorInduk.trim();

    if (!isValidEmail(email)) return toast.error("Format email tidak valid");
    if (!/^\d{4,20}$/.test(nomorInduk))
      return toast.error("Nomor induk harus berupa angka (NIS/NISN)");
    if (!form.tanggalLahir) return toast.error("Tanggal lahir wajib diisi");
    if (new Date(form.tanggalLahir).getTime() > Date.now())
      return toast.error("Tanggal lahir tidak boleh di masa depan");
    if (!form.agree)
      return toast.error("Anda harus menyetujui Kebijakan Privasi & Syarat Layanan");

    setLoading(true);
    try {
      const { error } = await api.auth.register({
        email,
        nomor_induk: nomorInduk,
        tanggal_lahir: form.tanggalLahir,
      });

      if (error) {
        toast.error(error.message || error.error || "Registrasi gagal");
        return;
      }

      setSentTo(email);
      toast.success("Registrasi berhasil. Cek email untuk tautan aktivasi.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  if (sentTo) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
            <MailCheck className="size-5" />
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">Cek Email Anda</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Tautan aktivasi sudah dikirim ke{" "}
            <span className="font-semibold text-slate-700">{sentTo}</span>. Buka tautan
            tersebut untuk membuat kata sandi akun Anda.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-4" />

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
          <p className="text-[11px] leading-relaxed text-indigo-800">
            Tautan aktivasi berlaku <span className="font-bold">24 jam</span> dan
            hanya dapat dipakai <span className="font-bold">sekali</span>. Periksa juga
            folder spam bila email belum terlihat.
          </p>
        </div>

        <Link
          href="/auth/login"
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
        >
          Kembali ke Halaman Masuk
          <ArrowRight className="size-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => setSentTo(null)}
          className="w-full text-xs font-semibold text-slate-500 hover:text-slate-700 transition"
        >
          Salah menulis email? Daftar ulang
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            Registrasi Siswa
          </span>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Aktifkan Akun Baru</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Khusus siswa yang datanya sudah terdaftar pada roster sekolah.
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
          <UserIcon className="size-4" />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4" />

      <TextField
        id="email"
        label="Email"
        hint="Tautan aktivasi dikirim ke sini"
        icon={<MailIcon className="size-3.5" />}
        type="email"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        placeholder="nama@smkmataram.sch.id"
        autoComplete="email"
      />

      <TextField
        id="nomorInduk"
        label="Nomor Induk Siswa"
        hint="NIS / NISN"
        icon={<Hash className="size-3.5" />}
        value={form.nomorInduk}
        onChange={(e) => update("nomorInduk", e.target.value)}
        placeholder="Contoh: 0065849201"
        inputMode="numeric"
      />

      <TextField
        id="tanggalLahir"
        label="Tanggal Lahir"
        hint="Sesuai data sekolah"
        icon={<CalendarDays className="size-3.5" />}
        type="date"
        value={form.tanggalLahir}
        onChange={(e) => update("tanggalLahir", e.target.value)}
        autoComplete="bday"
      />

      <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3">
        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-600">
          <UserRoundIcon className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
          Nomor induk dan tanggal lahir harus sama dengan data yang diimpor admin
          sekolah. Bila belum terdaftar, hubungi admin Dapodik.
        </p>
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={form.agree}
          onChange={(e) => update("agree", e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-slate-300 accent-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-xs leading-relaxed text-slate-600">
          Saya menyetujui{" "}
          <a href="#" className="font-bold text-indigo-600 hover:underline">
            Kebijakan Privasi
          </a>{" "}
          dan{" "}
          <a href="#" className="font-bold text-indigo-600 hover:underline">
            Syarat Layanan
          </a>{" "}
          platform SiManis.
        </span>
      </label>

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full mt-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition active:scale-[0.99]"
        whileHover={{ scale: loading ? 1 : 1.015 }}
        whileTap={{ scale: loading ? 1 : 0.985 }}
      >
        <span>{loading ? "Mengirim data…" : "KIRIM TAUTAN AKTIVASI"}</span>
        <ArrowRight className="size-3.5" />
      </motion.button>

      <div className="border-t border-slate-200 pt-4 space-y-3">
        <p className="text-xs text-slate-600">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="font-bold text-indigo-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
        <p className="text-xs text-slate-600">
          Sudah pernah mendaftar tetapi belum aktivasi?{" "}
          <Link
            href="/auth/forgot-password"
            className="font-bold text-indigo-600 hover:underline"
          >
            Kirim ulang tautan
          </Link>
        </p>
      </div>
    </form>
  );
}
