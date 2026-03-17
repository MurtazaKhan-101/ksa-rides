"use client";

import { Suspense } from "react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import VerifyOtp from "../../components/authentication/verifyOtp";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#00B1C5] border-t-transparent animate-spin" /></div>}>
      <AuthLayout
        title="Verify your email"
        subtitle="Enter the code we sent to your email"
      >
        <VerifyOtp />
      </AuthLayout>
    </Suspense>
  );
}
