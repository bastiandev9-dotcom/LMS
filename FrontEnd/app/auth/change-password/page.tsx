import { ChangePasswordForm } from "./change-password-form";

export default function ChangePasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f9fd] px-6 py-10 text-slate-800 antialiased">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-sm font-extrabold text-white shadow-md shadow-indigo-200">
            S
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900">
              Ganti Password
            </h1>
            <p className="text-xs text-slate-500">SiManis • SMK Mataram</p>
          </div>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
