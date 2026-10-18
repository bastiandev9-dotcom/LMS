"use client";

import { AuthHero, AuthShell, type AuthHeroFeature } from "@/components/auth/auth-shell";
import { GraduationCapIcon, MailIcon, ShieldCheckIcon, ZapIcon } from "@/components/auth/auth-icons";
import { RegisterForm } from "./register-form";

const HERO_FEATURES: AuthHeroFeature[] = [
  {
    icon: <ShieldCheckIcon className="size-4" />,
    title: "Verifikasi Roster Sekolah",
    description:
      "Nomor induk dan tanggal lahir dicocokkan dengan roster yang diimpor admin, sehingga akun ganda tidak mungkin dibuat.",
    footer: "One-Data",
  },
  {
    icon: <MailIcon className="size-4" />,
    title: "Aktivasi Lewat Email",
    description:
      "Kata sandi Anda buat sendiri melalui tautan aktivasi yang berlaku 24 jam dan hanya bisa dipakai sekali.",
    footer: "Verifikasi Berlapis",
  },
  {
    icon: <ZapIcon className="size-4" />,
    title: "Satu Akun untuk Semua Layanan",
    description:
      "Akses CBT, e-Rapor, Classroom, Lab Cloud, dan Wifi Kampus dengan satu kredensial tunggal.",
    footer: "SSO Terpadu",
  },
];

export default function RegisterPage() {
  return (
    <AuthShell logoIcon={<GraduationCapIcon className="text-lg" />} hero={<Hero />}>
      <RegisterForm />
    </AuthShell>
  );
}

function Hero() {
  return (
    <AuthHero
      badge="SMK MATARAM • PENDAFTARAN"
      title={
        <>
          Buat Akun Terpadu
          <span className="block text-indigo-600">SiManis SMK Mataram</span>
        </>
      }
      description="Pendaftaran mandiri untuk siswa yang datanya sudah terdaftar pada roster sekolah. Masukkan email, nomor induk, dan tanggal lahir, lalu buat kata sandi Anda lewat tautan aktivasi."
      features={HERO_FEATURES}
      stat={{
        title: "1,842 Siswa & 128 Pendidik Terdaftar",
        subtitle: "Enkripsi End-to-End SHA-256 Aktif & Terverifikasi",
        chip: "Live Sync",
        extra: "+1.9k",
      }}
    />
  );
}
