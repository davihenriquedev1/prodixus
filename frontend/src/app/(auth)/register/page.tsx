import { RegisterForm } from "@/features/auth/components/register-form";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          aria-label="Prodixus — página inicial"
          className="mb-8 flex justify-center"
        >
          <Image
            src="/logo-vert-no-background.png"
            alt="Prodixus"
            width={124}
            height={124}
            className="object-contain"
            priority
          />
        </Link>

        <RegisterForm />
      </div>
    </main>
  );
}
