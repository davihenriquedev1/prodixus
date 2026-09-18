import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0A0C10] text-[#E2E8F0] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
