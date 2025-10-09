"use client";
import LoginForm from "@/features/auth/login/components/LoginForm";
import PublicOnlyGuard from "@/hoc/PublicOnlyGuard";
import { Suspense } from "react";

function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

export default PublicOnlyGuard(LoginPage);
