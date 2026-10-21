"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowDownUp,
  ArrowRight,
  Atom,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code,
  Download,
  Eye,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  Layers,
  LayoutGrid,
  Library,
  List,
  Mic,
  Palette,
  Paperclip,
  Play,
  PlayCircle,
  Presentation,
  Search,
  SearchX,
  ShieldCheck,
  Sigma,
  Users,
  Video,
} from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem, CountUp } from "@/components/ui/animations";

type SubjectKey = "cs" | "physics" | "math" | "vocational" | "language";
type StatusKey = "in_progress" | "completed" | "new";
type StatusFilter = "all" | StatusKey;

type Module = {
  id: string;
  title: string;
  kicker: string;
  desc: string;
  subject: SubjectKey;
  subjectLabel: string;
  subjectClass: string;
  tag: string;
  tagClass: string;
  image: string;
  info: { icon: typeof BookOpen; text: string }[];
  progress: number;
  status: StatusKey;
  action: string;
  actionIcon: typeof Play;
};

const inter = { fontFamily: "var(--font-inter), system-ui, sans-serif" } as const;
const jakarta = { fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" } as const;

const subjectTabs: { key: "all" | SubjectKey; label: string }[] = [
  { key: "all", label: "Semua Mata Pelajaran" },
  { key: "cs", label: "Informatika & Ilmu Komputer" },
  { key: "physics", label: "Fisika Terapan & Robotika" },
  { key: "math", label: "Matematika Tingkat Lanjut" },
  { key: "vocational", label: "Kejuruan (DKV / TKR)" },
  { key: "language", label: "Bahasa & Literasi" },
];

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "in_progress", label: "Sedang Berjalan" },
  { value: "completed", label: "Selesai Dipelajari" },
  { value: "new", label: "Modul Baru (New)" },
];

const classOptions = [
  "Kelas XII MIPA 1 / Kejuruan",
  "Kelas XII MIPA 2 / Kejuruan",
  "Kelas XI Industri & Rekayasa",
  "Materi Ekstrakurikuler Khusus",
];

const modules: Module[] = [
  {
    id: "algo-big-o",
    title: "Algoritma Pemrograman & Optimasi Big-O",
    kicker: "FASE F • KELAS XII",
    desc: "Catatan kuliah struktural, analisis efisiensi memori, slide presentasi guru, dan 14 bank latihan soal interaktif.",
    subject: "cs",
    subjectLabel: "Informatika",
    subjectClass: "bg-[#0d5c52] text-white",
    tag: "Kurikulum Merdeka",
    tagClass: "bg-white/90 text-[#0d5c52] backdrop-blur-sm",
    image: "/modules/algo-big-o.jpg",
    info: [
      { icon: BookOpen, text: "6 Bab Lengkap" },
      { icon: FolderOpen, text: "12 Bahan Ajar" },
    ],
    progress: 70,
    status: "in_progress",
    action: "Buka Modul",
    actionIcon: PlayCircle,
  },
  {
    id: "thermo-wave",
    title: "Termodinamika & Gelombang Mekanik",
    kicker: "FASE F • SAINS FISIKA",
    desc: "Panduan praktikum virtual PhET Interactive Simulations, bank soal latihan mandiri, dan rekaman demonstrasi termodinamika.",
    subject: "physics",
    subjectLabel: "Fisika Terapan",
    subjectClass: "bg-[#00796b] text-white",
    tag: "Ada Remedial",
    tagClass: "bg-[#ffdad6] text-[#93000a]",
    image: "/modules/thermo-wave.jpg",
    info: [
      { icon: Atom, text: "5 Bab Inti" },
      { icon: Presentation, text: "8 Lab Sheet" },
    ],
    progress: 45,
    status: "in_progress",
    action: "Buka Modul",
    actionIcon: PlayCircle,
  },
  {
    id: "calc-matrix",
    title: "Kalkulus Lanjut & Aljabar Linier Matriks",
    kicker: "FASE F • OLIMPIADE & UTBK",
    desc: "Diktat materi eksklusif SMK Mataram, bank soal seleksi PTN Mandiri ITB/UI, dan solusi penyelesaian matriks orde tinggi.",
    subject: "math",
    subjectLabel: "Matematika Lanjut",
    subjectClass: "bg-[#0d5c52] text-white",
    tag: "Persiapan UTBK",
    tagClass: "bg-[#a6f2cf] text-[#002115]",
    image: "/modules/calc-matrix.jpg",
    info: [
      { icon: Sigma, text: "8 Bab Silabus" },
      { icon: FileText, text: "15 Dokumen PDF" },
    ],
    progress: 100,
    status: "completed",
    action: "Ulas Kembali",
    actionIcon: Eye,
  },
  {
    id: "ai-ml",
    title: "Kecerdasan Buatan & Machine Learning",
    kicker: "FASE F • TEKNOLOGI TERAPAN",
    desc: "Dataset latih CSV, Google Colab Jupyter notebooks terintegrasi, dan modul sintaksis PyTorch/TensorFlow dasar.",
    subject: "cs",
    subjectLabel: "Informatika Peminatan",
    subjectClass: "bg-[#14b8a6] text-white",
    tag: "Baru Diunggah",
    tagClass: "bg-[#71f8e4] text-[#00201c]",
    image: "/modules/ai-ml.jpg",
    info: [
      { icon: Code, text: "4 Bab Praktik" },
      { icon: Layers, text: "Colab Notebooks" },
    ],
    progress: 0,
    status: "new",
    action: "Mulai Belajar",
    actionIcon: Play,
  },
  {
    id: "english-research",
    title: "English for Academic & Technical Research",
    kicker: "FASE F • KOMUNIKASI GLOBAL",
    desc: "Academic writing guidelines, panduan pembuatan esai beasiswa riset luar negeri, dan audio listening technical conference.",
    subject: "language",
    subjectLabel: "Bahasa & Literasi",
    subjectClass: "bg-[#00796b] text-white",
    tag: "Sains & Teknologi",
    tagClass: "bg-white/90 text-[#0d5c52] backdrop-blur-sm",
    image: "/modules/english-research.jpg",
    info: [
      { icon: Mic, text: "4 Bab Audio Lab" },
      { icon: FileText, text: "Format Esai Ilmiah" },
    ],
    progress: 100,
    status: "completed",
    action: "Ulas Audio & Teks",
    actionIcon: Eye,
  },
  {
    id: "uiux-dkv",
    title: "Desain Sistem & Antarmuka UI/UX Modern",
    kicker: "FASE F • DESAIN PRODUK",
    desc: "Design tokens, wireframing komponen atomik, Figma master design kit, dan panduan usability testing standar industri digital.",
    subject: "vocational",
    subjectLabel: "Kejuruan DKV",
    subjectClass: "bg-[#0d5c52] text-white",
    tag: "Proyek Kolaboratif",
    tagClass: "bg-[#a6f2cf] text-[#002115]",
    image: "/modules/uiux-dkv.jpg",
    info: [
      { icon: Layers, text: "6 Bab Proyek" },
      { icon: Palette, text: "Figma UI Assets" },
    ],
    progress: 82,
    status: "in_progress",
    action: "Buka Modul",
    actionIcon: PlayCircle,
  },
];

type SyllabusDoc = {
  type: string;
  typeClass: string;
  title: string;
  meta: string;
  level: string;
  author: string;
  verified: string;
  VerifiedIcon: typeof BadgeCheck;
};

const syllabusDocs: SyllabusDoc[] = [
  {
    type: "PDF",
    typeClass: "bg-[#ffdad6] text-[#93000a]",
    title: "Silabus ATP & CP Informatika Tingkat Lanjut",
    meta: "SMK-MATARAM-CP-INF-2024.pdf • 1.8 MB",
    level: "Fase F (Kelas XII)",
    author: "Tim Kurikulum Informatika",
    verified: "Disahkan Waka Kurikulum",
    VerifiedIcon: CheckCircle2,
  },
  {
    type: "PDF",
    typeClass: "bg-[#ccfbf1] text-[#004d40]",
    title: "Panduan Praktik Laboratorium Sains & Robotika Terapan",
    meta: "SMK-MATARAM-LAB-FIS-ROB.pdf • 3.2 MB",
    level: "Fase F (Kelas XI & XII)",
    author: "Laboratorium Fisika Modern",
    verified: "Disahkan Waka Kurikulum",
    VerifiedIcon: CheckCircle2,
  },
  {
    type: "DOCX",
    typeClass: "bg-[#cee8e1] text-[#0d5c52]",
    title: "Rubrik Penilaian Proyek Ujian Kompetensi Keahlian (UKK) DKV",
    meta: "RUBRIK-UKK-DKV-FINAL.docx • 890 KB",
    level: "Fase F Kejuruan",
    author: "Asosiasi Industri DKV Mataram",
    verified: "Standar BNSP",
    VerifiedIcon: BadgeCheck,
  },
];

function progressText(m: Module) {
  if (m.status === "new")
    return { text: "0% Belum Dimulai", className: "text-[#6f7976]" };
  if (m.status === "completed")
    return {
      text: "100% Selesai",
      className: "text-[#0d5c52] flex items-center gap-1",
    };
  return {
    text: `${m.progress}% Selesai`,
    className: m.subject === "physics" ? "text-[#00796b]" : "text-[#0d5c52]",
  };
}

function barClass(m: Module) {
  if (m.status === "new") return "bg-[#bec9c5]";
  if (m.subject === "physics") return "bg-[#00796b]";
  return "bg-[#0d5c52]";
}

export function StudentModules() {
  const router = useRouter();
  const [subject, setSubject] = useState<"all" | SubjectKey>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const visibleModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = modules.filter((m) => {
      const matchesSubject = subject === "all" || m.subject === subject;
      const matchesStatus = status === "all" || m.status === status;
      const haystack = [m.title, m.desc, m.kicker, m.subjectLabel, ...m.info.map((i) => i.text)]
        .join(" ")
        .toLowerCase();
      const matchesQuery = q === "" || haystack.includes(q);
      return matchesSubject && matchesStatus && matchesQuery;
    });
    return sort === "newest" ? filtered : [...filtered].reverse();
  }, [subject, status, query, sort]);

  return (
    <FadeIn className="w-full">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8" style={inter}>
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="flex max-w-3xl flex-col gap-1">
            <nav className="flex items-center gap-1 text-[13px] font-semibold leading-[18px] text-[#3f4946]">
              <a
                href="/student/dashboard"
                className="flex items-center gap-1 transition-colors hover:text-[#0d5c52]"
              >
                <Home className="size-4" />
                Dashboard
              </a>
              <span className="text-[#bec9c5]">/</span>
              <span className="text-[#0d5c52]">Modules &amp; Learning Materials</span>
            </nav>
            <h1
              className="mt-1 flex flex-wrap items-center gap-2 text-[26px] font-bold leading-[34px] tracking-tight text-[#071f1c]"
              style={jakarta}
            >
              Katalog Modul &amp; Materi Pembelajaran
              <span className="rounded-full bg-[#cee8e1] px-2.5 py-0.5 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.04em] text-[#0d5c52]">
                Semester Ganjil 2025/2026
              </span>
            </h1>
            <p className="mt-1 text-[14px] leading-5 text-[#3f4946]">
              Akses seluruh modul ajar Kurikulum Merdeka, silabus terstruktur, rekaman video
              praktikum, dan materi pengayaan berbasis kejuruan &amp; sains SMK Mataram.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[210px]">
              <Users className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-[#3f4946]" />
              <select
                aria-label="Pilih kelas"
                defaultValue={classOptions[0]}
                className="h-11 w-full cursor-pointer appearance-none rounded-lg bg-white pl-10 pr-8 text-[13px] font-semibold leading-[18px] text-[#071f1c] shadow-sm transition-colors hover:bg-[#edf7f4] focus:outline-none focus:ring-2 focus:ring-[#0d5c52]/20"
              >
                {classOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#3f4946]" />
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                alert("Arsip silabus (.zip) sedang disiapkan. Fitur unduh aktif setelah integrasi backend.")
              }
              className="flex h-11 items-center gap-1 rounded-lg bg-[#0d5c52] px-4 text-[14px] font-semibold leading-5 text-white shadow-md transition-colors duration-200 hover:bg-[#004d40]"
            >
              <Download className="size-[19px]" />
              Unduh Semua Silabus (.zip)
            </motion.button>
          </div>
        </div>

        {/* Metric Cards */}
        <StaggerChildren staggerDelay={0.08} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerItem>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-white p-4 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] transition-shadow hover:shadow-md">
              <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-[#edf7f4]/60 transition-transform duration-300 group-hover:scale-125" />
              <div className="relative flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.04em] text-[#3f4946]">
                  Total Modul Tersedia
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#d4eee7] text-[#0d5c52]">
                  <BookOpen className="size-5" />
                </span>
              </div>
              <div className="relative mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold leading-10 text-[#071f1c]">
                    <CountUp to={28} duration={1.2} />
                  </span>
                  <span className="text-[13px] font-semibold leading-[18px] text-[#0d5c52]">
                    Modul Aktif
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[12px] leading-[18px] text-[#3f4946]">
                  <span className="size-2 rounded-full bg-[#0d5c52]" />
                  <span>18 Wajib</span>
                  <span className="text-[#bec9c5]">•</span>
                  <span className="size-2 rounded-full bg-[#00796b]" />
                  <span>10 Peminatan</span>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-white p-4 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] transition-shadow hover:shadow-md">
              <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-[#edf7f4]/60 transition-transform duration-300 group-hover:scale-125" />
              <div className="relative flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.04em] text-[#3f4946]">
                  Telah Dipelajari
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#ccfbf1] text-[#004d40]">
                  <CheckCircle2 className="size-5" />
                </span>
              </div>
              <div className="relative mt-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[32px] font-bold leading-10 text-[#071f1c]">
                    <CountUp to={19} duration={1.2} />{" "}
                    <span className="text-[15px] font-normal leading-[22px] text-[#3f4946]">
                      / 28
                    </span>
                  </span>
                  <span className="rounded-full bg-[#a6f2cf] px-2 py-0.5 text-[11px] font-bold leading-[14px] text-[#002115]">
                    68% Tuntas
                  </span>
                </div>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#cee8e1]">
                  <motion.div
                    className="h-full rounded-full bg-[#0d5c52]"
                    initial={{ width: 0 }}
                    whileInView={{ width: "68%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-white p-4 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] transition-shadow hover:shadow-md">
              <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-[#edf7f4]/60 transition-transform duration-300 group-hover:scale-125" />
              <div className="relative flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.04em] text-[#3f4946]">
                  Bahan Bacaan &amp; E-Book
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#d4eee7] text-[#0d5c52]">
                  <Library className="size-5" />
                </span>
              </div>
              <div className="relative mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold leading-10 text-[#071f1c]">
                    <CountUp to={42} duration={1.2} />
                  </span>
                  <span className="text-[13px] leading-[18px] text-[#3f4946]">Dokumen</span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-[12px] leading-[18px] text-[#3f4946]">
                  <FileText className="size-[15px] text-[#0d5c52]" />
                  Format PDF, e-Pub &amp; Diktat Resmi
                </p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-white p-4 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] transition-shadow hover:shadow-md">
              <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-[#edf7f4]/60 transition-transform duration-300 group-hover:scale-125" />
              <div className="relative flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.04em] text-[#3f4946]">
                  Lab &amp; Praktikum
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#a6f2cf] text-[#002115]">
                  <Video className="size-5" />
                </span>
              </div>
              <div className="relative mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold leading-10 text-[#071f1c]">
                    <CountUp to={14} duration={1.2} />
                  </span>
                  <span className="text-[13px] font-semibold leading-[18px] text-[#0d5c52]">
                    Sesi Rekaman
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-[12px] leading-[18px] text-[#3f4946]">
                  <Video className="size-[15px] text-[#0d5c52]" />
                  Video Eksperimen Kualitas 1080p
                </p>
              </div>
            </div>
          </StaggerItem>
        </StaggerChildren>

        {/* Featured Active Module */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d5c52] via-[#0d5c52] to-[#004d40] p-6 text-white shadow-lg">
          <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-[#abf0e2]/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/3 size-64 rounded-full bg-[#71f8e4]/10 blur-2xl" />
          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex max-w-2xl flex-col gap-2">
              <div className="flex flex-wrap items-center gap-1">
                <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.04em] text-[#abf0e2] backdrop-blur-md">
                  <span className="size-2 animate-pulse rounded-full bg-[#14b8a6]" />
                  Sedang Dipelajari Minggu Ini
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold leading-[14px] text-white">
                  Informatika &amp; Sains Komputasi
                </span>
              </div>
              <h2
                className="text-[26px] font-bold leading-[34px] tracking-tight text-white"
                style={jakarta}
              >
                Advanced Graph Algorithms &amp; Applied Quantum Physics
              </h2>
              <p className="text-[14px] leading-5 text-[#8fd3c6]">
                Bab 4: Implementasi Algoritma Dijkstra, Shortest Path Optimization, &amp; Analisis
                Komputasi Jaringan.
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] leading-[18px] text-[#abf0e2]">
                <span className="flex items-center gap-1">
                  <GraduationCap className="size-4" />
                  Dr. Pawell Bennett, S.Kom &amp; Mrs. Sarah V.
                </span>
                <span className="opacity-50">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-4" />
                  Est. Waktu Membaca: ~35 Menit
                </span>
                <span className="opacity-50">•</span>
                <span className="flex items-center gap-1">
                  <Paperclip className="size-4" />
                  4.2 MB PDF Lengkap
                </span>
              </div>
              <div className="mt-2 max-w-md">
                <div className="mb-1.5 flex justify-between text-[11px] font-semibold leading-[14px] text-[#abf0e2]">
                  <span>Progres Sesi Bab 4</span>
                  <span className="font-bold text-white">75% Selesai (Sisa 1 Praktikum)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#00433b]/60">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#8fd3c6] to-[#abf0e2]" />
                </div>
              </div>
            </div>
            <div className="flex min-w-[220px] flex-col gap-2 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={() => router.push("/student/modules/algoritma-pemrograman-optimasi-big-o")}
                className="group flex items-center justify-center gap-1 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold leading-[22px] text-[#0d5c52] shadow-md transition-colors duration-200 hover:bg-[#abf0e2]"
              >
                Lanjutkan Belajar
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => alert("Unduhan PDF modul aktif setelah integrasi storage backend.")}
                className="flex items-center justify-center gap-1 rounded-xl bg-white/10 px-4 py-2.5 text-[14px] font-semibold leading-5 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/20"
              >
                <Download className="size-[18px]" />
                Unduh PDF Modul Lengkap
              </button>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1">
            <div className="flex min-w-max items-center gap-1">
              {subjectTabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setSubject(t.key)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold leading-[18px] transition-all ${
                    subject === t.key
                      ? "bg-[#0d5c52] text-white shadow-sm"
                      : "bg-white text-[#3f4946] hover:bg-[#d4eee7] hover:text-[#0d5c52]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex shrink-0 items-center rounded-lg bg-white p-1 shadow-sm">
              <button
                type="button"
                title="Tampilan Kisi"
                aria-label="Tampilan kisi"
                onClick={() => setView("grid")}
                className={`rounded-md p-1.5 transition-colors ${
                  view === "grid"
                    ? "bg-[#d4eee7] text-[#0d5c52]"
                    : "text-[#3f4946] hover:text-[#0d5c52]"
                }`}
              >
                <LayoutGrid className="size-5" />
              </button>
              <button
                type="button"
                title="Tampilan Daftar"
                aria-label="Tampilan daftar"
                onClick={() => setView("list")}
                className={`rounded-md p-1.5 transition-colors ${
                  view === "list"
                    ? "bg-[#d4eee7] text-[#0d5c52]"
                    : "text-[#3f4946] hover:text-[#0d5c52]"
                }`}
              >
                <List className="size-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-2 px-4 shadow-sm md:flex-row">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-[#3f4946]" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari judul modul, bab materi, kode KD, atau keyword praktikum..."
                aria-label="Cari modul"
                className="h-10 w-full rounded-lg bg-[#edf7f4] pl-9 pr-4 text-[13px] leading-[18px] text-[#071f1c] placeholder:text-[#6f7976] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d5c52]/20"
              />
            </div>
            <div className="flex w-full items-center justify-end gap-2 md:w-auto">
              <span className="text-[11px] font-semibold leading-[14px] text-[#3f4946]">Status:</span>
              <select
                aria-label="Filter status"
                value={status}
                onChange={(event) => setStatus(event.target.value as StatusFilter)}
                className="h-10 cursor-pointer rounded-lg bg-[#edf7f4] px-3 text-[13px] font-semibold leading-[18px] text-[#071f1c] focus:outline-none"
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="h-6 w-px bg-[#cee8e1]" />
              <button
                type="button"
                onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
                className="flex h-10 items-center gap-1 rounded-lg bg-[#edf7f4] px-3 text-[13px] font-semibold leading-[18px] text-[#071f1c] transition-colors hover:bg-[#d4eee7]"
              >
                <ArrowDownUp className="size-[18px]" />
                {sort === "newest" ? "Terbaru" : "Terlama"}
              </button>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        {visibleModules.length === 0 ? (
          <FadeIn>
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-10 text-center text-[#3f4946]">
              <SearchX className="size-8 text-[#bec9c5]" />
              <span className="text-[15px] font-semibold leading-[22px]">
                Tidak ada modul yang cocok dengan filter Anda.
              </span>
              <span className="text-[13px] leading-[18px]">
                Coba ubah kata kunci, status, atau pilih mata pelajaran lain.
              </span>
            </div>
          </FadeIn>
        ) : (
          <StaggerChildren
            as="div"
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                : "grid grid-cols-1 gap-4"
            }
          >
            {visibleModules.map((m) => {
              const pText = progressText(m);
              const ActionIcon = m.actionIcon;
              const src = m.image;
              return (
                <StaggerItem key={m.id}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] transition-shadow duration-200 hover:shadow-md">
                    <div className="relative h-44 w-full overflow-hidden bg-[#e2f2ee]">
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 304px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-[14px] ${m.subjectClass}`}
                        >
                          {m.subjectLabel}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold leading-[14px] ${m.tagClass}`}
                        >
                          {m.tag}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.02em] opacity-90">
                          {m.kicker}
                        </span>
                        <h3
                          className="truncate text-[15px] font-semibold leading-[22px]"
                          style={jakarta}
                        >
                          {m.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <p className="line-clamp-2 text-[12px] leading-[18px] text-[#3f4946]">
                        {m.desc}
                      </p>
                      <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#edf7f4] p-2">
                        {m.info.map((info) => (
                          <div key={info.text} className="flex items-center gap-1.5">
                            <info.icon
                              className={`size-4 shrink-0 ${
                                m.subject === "physics" || m.subject === "language"
                                  ? "text-[#00796b]"
                                  : "text-[#0d5c52]"
                              }`}
                            />
                            <span className="text-[11px] font-semibold leading-[14px] text-[#3f4946]">
                              {info.text}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto flex flex-col gap-1 pt-1">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold leading-[14px] text-[#3f4946]">
                          <span className="min-w-0">Status Pemahaman</span>
                          <span
                            className={`shrink-0 whitespace-nowrap text-right font-semibold ${pText.className}`}
                          >
                            {m.status === "completed" && <CheckCircle2 className="size-3.5" />}
                            {pText.text}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#cee8e1]">
                          <motion.div
                            className={`h-full rounded-full ${barClass(m)}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.max(m.progress, 3)}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-4 pt-0">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (m.id === "algo-big-o") {
                            router.push("/student/modules/algoritma-pemrograman-optimasi-big-o");
                            return;
                          }
                          alert(
                            `Modul "${m.title}" dibuka. Fitur pembelajaran aktif setelah integrasi backend.`
                          );
                        }}
                        className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-[14px] font-semibold leading-5 transition-colors ${
                          m.status === "new"
                            ? "bg-[#0d5c52] text-white hover:bg-[#004d40]"
                            : "bg-[#d4eee7] text-[#0d5c52] hover:bg-[#cee8e1]"
                        }`}
                      >
                        <ActionIcon className="size-[18px]" />
                        {m.action}
                      </motion.button>
                      <button
                        type="button"
                        title={`Unduh materi ${m.title}`}
                        aria-label={`Unduh materi ${m.title}`}
                        onClick={() =>
                          alert(`Unduhan "${m.title}" aktif setelah integrasi storage backend.`)
                        }
                        className="rounded-lg bg-[#edf7f4] p-2 text-[#3f4946] transition-colors hover:bg-[#e2f2ee] hover:text-[#0d5c52]"
                      >
                        <Download className="size-5" />
                      </button>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        )}

        {/* Syllabus & Curriculum Documents */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)]">
          <div className="flex flex-col justify-between gap-2 border-b border-[#cee8e1] pb-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#d4eee7] text-[#0d5c52]">
                <ShieldCheck className="size-[22px]" />
              </div>
              <div>
                <h2
                  className="text-[15px] font-bold leading-[22px] text-[#071f1c]"
                  style={jakarta}
                >
                  Daftar Silabus &amp; Dokumen Kurikulum Resmi
                </h2>
                <p className="text-[12px] leading-[18px] text-[#3f4946]">
                  Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), dan Panduan Standar
                  Kelulusan Kejuruan.
                </p>
              </div>
            </div>
            <span className="self-start rounded-full bg-[#edf7f4] px-3 py-1 text-[11px] font-semibold leading-[14px] text-[#3f4946] sm:self-auto">
              Tahun Ajaran 2024 / 2025
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[12px] leading-[18px]">
              <thead>
                <tr className="border-b border-[#d4eee7] text-[11px] font-semibold uppercase tracking-[0.02em] text-[#3f4946]">
                  <th className="px-4 py-3 font-semibold">Nama Dokumen &amp; Mata Pelajaran</th>
                  <th className="px-4 py-3 font-semibold">Tingkat / Fase</th>
                  <th className="px-4 py-3 font-semibold">Penyusun / Guru Pembina</th>
                  <th className="px-4 py-3 font-semibold">Status Verifikasi</th>
                  <th className="px-4 py-3 text-right font-semibold">Aksi Unduh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf7f4]">
                {syllabusDocs.map((doc) => {
                  const TypeIcon = doc.VerifiedIcon;
                  return (
                    <tr
                      key={doc.meta}
                      className="transition-colors hover:bg-[#edf7f4]/50"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex size-8 items-center justify-center rounded-lg text-[11px] font-bold leading-[14px] ${doc.typeClass}`}
                          >
                            {doc.type}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-[15px] font-semibold leading-[22px] text-[#071f1c]">
                              {doc.title}
                            </span>
                            <span className="text-[12px] leading-[18px] text-[#3f4946]">
                              {doc.meta}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[13px] font-semibold leading-[18px] text-[#071f1c]">
                        {doc.level}
                      </td>
                      <td className="px-4 py-3.5 text-[#3f4946]">{doc.author}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#a6f2cf] px-2.5 py-0.5 text-[11px] font-semibold leading-[14px] text-[#002115]">
                          <TypeIcon className="size-[13px]" />
                          {doc.verified}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            alert(`Unduhan "${doc.title}" aktif setelah integrasi storage backend.`)
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-[#e2f2ee] px-3 py-1.5 text-[13px] font-semibold leading-[18px] text-[#0d5c52] transition-colors hover:bg-[#d4eee7]"
                        >
                          <Download className="size-4" />
                          Unduh (.{doc.type})
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
