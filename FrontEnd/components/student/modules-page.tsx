"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Atom,
  BookOpen,
  CheckCircle2,
  Code,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Home,
  Layers,
  LayoutGrid,
  Library,
  List,
  Mic,
  Palette,
  Play,
  Presentation,
  SearchX,
  Sigma,
  Users,
  Video,
} from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem, CountUp } from "@/components/ui/animations";

type SubjectKey = "cs" | "physics" | "math" | "vocational" | "language";
type StatusKey = "in_progress" | "completed" | "new";

type Module = {
  id: string;
  title: string;
  kicker: string;
  desc: string;
  subject: SubjectKey;
  subjectLabel: string;
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
    desc: "Catatan kuliah struktural, analisis efisiensi memori, slide presentasi.",
    subject: "cs",
    subjectLabel: "Informatika",
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
    actionIcon: Play,
  },
  {
    id: "thermo-wave",
    title: "Termodinamika & Gelombang Mekanik",
    kicker: "FASE F • SAINS FISIKA",
    desc: "Panduan praktikum virtual PhET Interactive Simulations, bank soal.",
    subject: "physics",
    subjectLabel: "Fisika Terapan",
    tag: "Ada Remedial",
    tagClass: "bg-white/90 text-[#93000a] backdrop-blur-sm",
    image: "/modules/thermo-wave.jpg",
    info: [
      { icon: Atom, text: "5 Bab Inti" },
      { icon: Presentation, text: "8 Lab Sheet" },
    ],
    progress: 45,
    status: "in_progress",
    action: "Buka Modul",
    actionIcon: Play,
  },
  {
    id: "calc-matrix",
    title: "Kalkulus Lanjut & Aljabar Linier Matriks",
    kicker: "FASE F • OLIMPIADE & UTBK",
    desc: "Diktat materi eksklusif SMK Mataram, bank soal seleksi PTN.",
    subject: "math",
    subjectLabel: "Matematika Lanjut",
    tag: "Persiapan UTBK",
    tagClass: "bg-white/90 text-[#002115] backdrop-blur-sm",
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
    tag: "Baru Diunggah",
    tagClass: "bg-white/90 text-[#00201c] backdrop-blur-sm",
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
    desc: "Academic writing guidelines, panduan pembuatan esai beasiswa.",
    subject: "language",
    subjectLabel: "Bahasa & Literasi",
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
    desc: "Design tokens, wireframing komponen atomik, Figma master.",
    subject: "vocational",
    subjectLabel: "Kejuruan DKV",
    tag: "Proyek Kolaboratif",
    tagClass: "bg-white/90 text-[#002115] backdrop-blur-sm",
    image: "/modules/uiux-dkv.jpg",
    info: [
      { icon: Layers, text: "6 Bab Proyek" },
      { icon: Palette, text: "Figma UI Assets" },
    ],
    progress: 82,
    status: "in_progress",
    action: "Buka Modul",
    actionIcon: Play,
  },
];

function progressText(m: Module) {
  if (m.status === "new") return { text: "0% Belum Dimulai", className: "text-[#6f7976]" };
  if (m.status === "completed")
    return { text: "100% Selesai", className: "text-[#0d5c52] flex items-center gap-1" };
  return { text: `${m.progress}% Selesai`, className: "text-[#0d5c52]" };
}

export function StudentModules() {
  const router = useRouter();
  const [subject, setSubject] = useState<"all" | SubjectKey>("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const visibleModules = useMemo(
    () => modules.filter((m) => subject === "all" || m.subject === subject),
    [subject]
  );

  return (
    <FadeIn className="w-full">
      <div className="flex w-full flex-col gap-8" style={inter}>
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1">
            <nav className="flex items-center gap-1.5 text-[16px] leading-6 text-[#3f4946]">
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
              className="mt-1 text-[26px] font-bold leading-[34px] tracking-tight text-[#071f1c]"
              style={jakarta}
            >
              Katalog Modul &amp; Materi Pembelajaran
            </h1>
            <p className="mt-1 max-w-[606px] text-[16px] leading-[26px] text-[#3f4946]">
              Akses seluruh modul ajar Kurikulum Merdeka, silabus terstruktur, rekaman video
              praktikum, dan materi pengayaan berbasis kejuruan &amp; sains SMK Mataram.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-[#3f4946]" />
              <select
                aria-label="Pilih kelas"
                defaultValue={classOptions[0]}
                className="h-11 w-full appearance-none rounded-lg border border-[#6b7280] bg-white pl-10 pr-8 text-[16px] leading-6 text-[#071f1c] focus:outline-none focus:ring-2 focus:ring-[#0d5c52] lg:w-[300px]"
              >
                {classOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                alert("Arsip silabus (.zip) sedang disiapkan. Fitur unduh aktif setelah integrasi backend.")
              }
              className="flex h-11 items-center justify-center gap-1 rounded-lg bg-[#0d5c52] px-4 text-[16px] leading-6 text-white transition-colors duration-200 hover:bg-[#00433b]"
            >
              <Download className="size-4" />
              Unduh Semua Silabus (.zip)
            </motion.button>
          </div>
        </div>

        {/* Metric Cards */}
        <StaggerChildren staggerDelay={0.08} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StaggerItem>
            <div className="flex h-full min-h-[188px] flex-col justify-between gap-6 rounded-xl bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="max-w-[150px] text-[16px] uppercase leading-6 text-[#3f4946]">
                  Total Modul Tersedia
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#d4eee7] text-[#0d5c52]">
                  <BookOpen className="size-[18px]" />
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold leading-10 text-[#071f1c]">
                    <CountUp to={28} duration={1.2} />
                  </span>
                  <span className="text-[16px] font-semibold leading-6 text-[#0d5c52]">
                    Modul Aktif
                  </span>
                </div>
                <div className="flex gap-6 text-[16px] leading-6 text-[#3f4946]">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                      <span className="size-[7px] rounded-full bg-[#0d5c52]" />
                      18
                    </span>
                    Wajib
                  </div>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                      <span className="size-[7px] rounded-full bg-[#14b8a6]" />
                      10
                    </span>
                    Peminatan
                  </div>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex h-full min-h-[188px] flex-col justify-between gap-6 rounded-xl bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[16px] uppercase leading-6 text-[#3f4946]">
                  Telah Dipelajari
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#ccfbf1] text-[#0d5c52]">
                  <CheckCircle2 className="size-[18px]" />
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[32px] font-bold leading-10 text-[#071f1c]">
                    <CountUp to={19} duration={1.2} />{" "}
                    <span className="text-[15px] font-semibold leading-[22px] text-[#3f4946]">/ 28</span>
                  </span>
                  <span className="rounded-md bg-[#d4eee7] px-1.5 text-[16px] font-bold leading-6 text-[#002115]">
                    68% Tuntas
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#cee8e1]">
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
            <div className="flex h-full min-h-[188px] flex-col justify-between gap-6 rounded-xl bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="max-w-[150px] text-[16px] uppercase leading-6 text-[#3f4946]">
                  Bahan Bacaan &amp; E-Book
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#d4eee7] text-[#0d5c52]">
                  <Library className="size-[18px]" />
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold leading-10 text-[#071f1c]">
                    <CountUp to={42} duration={1.2} />
                  </span>
                  <span className="text-[16px] leading-6 text-[#3f4946]">Dokumen</span>
                </div>
                <p className="flex items-start gap-2 text-[16px] leading-6 text-[#3f4946]">
                  <FileText className="mt-1 size-4 shrink-0 text-[#0d5c52]" />
                  Format PDF, e-Pub &amp; Diktat Resmi
                </p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex h-full min-h-[188px] flex-col justify-between gap-6 rounded-xl bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[16px] uppercase leading-6 text-[#3f4946]">
                  Lab &amp; Praktikum
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#a6f2cf] text-[#0d5c52]">
                  <Video className="size-[18px]" />
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold leading-10 text-[#071f1c]">
                    <CountUp to={14} duration={1.2} />
                  </span>
                  <span className="text-[16px] font-semibold leading-6 text-[#0d5c52]">
                    Sesi Rekaman
                  </span>
                </div>
                <p className="flex items-start gap-2 text-[16px] leading-6 text-[#3f4946]">
                  <Video className="mt-1 size-4 shrink-0 text-[#0d5c52]" />
                  Video Eksperimen Kualitas 1080p
                </p>
              </div>
            </div>
          </StaggerItem>
        </StaggerChildren>

        {/* Filter Toolbar */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1">
          <div className="flex min-w-max items-center gap-1">
            {subjectTabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setSubject(t.key)}
                className={`h-10 whitespace-nowrap rounded-full px-4 py-2 text-[16px] leading-6 transition-colors ${
                  subject === t.key
                    ? "bg-[#0d5c52] text-white"
                    : "bg-white text-[#3f4946] hover:bg-[#d4eee7] hover:text-[#0d5c52]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center rounded-lg bg-white p-1">
            <button
              type="button"
              title="Tampilan Kisi"
              aria-label="Tampilan kisi"
              onClick={() => setView("grid")}
              className={`rounded-md p-1.5 transition-colors ${
                view === "grid" ? "bg-[#d4eee7] text-[#0d5c52]" : "text-[#3f4946] hover:text-[#0d5c52]"
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
                view === "list" ? "bg-[#d4eee7] text-[#0d5c52]" : "text-[#3f4946] hover:text-[#0d5c52]"
              }`}
            >
              <List className="size-5" />
            </button>
          </div>
        </div>

        {/* Modules Grid */}
        {visibleModules.length === 0 ? (
          <FadeIn>
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-10 text-center text-[#3f4946]">
              <SearchX className="size-8 text-[#bec9c5]" />
              <span className="text-[16px] leading-6 font-semibold">
                Tidak ada modul yang cocok dengan filter Anda.
              </span>
              <span className="text-[16px] leading-6">Coba pilih mata pelajaran lain.</span>
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
              return (
                <StaggerItem key={m.id}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white">
                    <div className="relative h-44 w-full overflow-hidden bg-[#e2f2ee]">
                      <Image
                        src={m.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 304px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-[#0d5c52] px-2.5 py-0.5 text-[16px] leading-6 text-white">
                          {m.subjectLabel}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[16px] font-semibold leading-6 ${m.tagClass}`}
                        >
                          {m.tag}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="block text-[16px] leading-6">{m.kicker}</span>
                        <h3
                          className="truncate text-[15px] font-semibold leading-[22px]"
                          style={jakarta}
                        >
                          {m.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <p className="text-[16px] leading-6 text-[#3f4946]">{m.desc}</p>
                      <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#edf7f4] p-2">
                        {m.info.map((info) => (
                          <div key={info.text} className="flex items-start gap-1.5">
                            <info.icon className="mt-1 size-4 shrink-0 text-[#0d5c52]" />
                            <span className="text-[16px] leading-6 text-[#3f4946]">
                              {info.text}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto flex flex-col gap-1 pt-1">
                        <div className="flex items-start justify-between gap-2 text-[16px] leading-6 text-[#3f4946]">
                          <span className="min-w-0">Status Pemahaman</span>
                          <span className={`shrink-0 whitespace-nowrap text-right font-semibold ${pText.className}`}>
                            {m.status === "completed" && <CheckCircle2 className="size-4" />}
                            {pText.text}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#cee8e1]">
                          <motion.div
                            className={`h-full rounded-full ${
                              m.status === "new" ? "bg-[#bec9c5]" : "bg-[#0d5c52]"
                            }`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.max(m.progress, 3)}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-4 pt-0">
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
                        className={`flex h-10 w-full items-center justify-center gap-1 rounded-lg py-2 text-[16px] leading-6 transition-colors ${
                          m.status === "new"
                            ? "bg-[#0d5c52] text-white hover:bg-[#00433b]"
                            : "bg-[#d4eee7] text-[#0d5c52] hover:bg-[#cee8e1]"
                        }`}
                      >
                        <ActionIcon className="size-4" />
                        {m.action}
                      </motion.button>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        )}
      </div>
    </FadeIn>
  );
}
