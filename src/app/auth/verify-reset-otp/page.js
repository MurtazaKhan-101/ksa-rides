"use client";

import { Suspense } from "react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import VerifyResetOtp from "../../components/authentication/verifyResetOtp";
import { useTranslation } from "../../../lib/i18n";

function VerifyResetOtpContent() {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.verify_reset_code_title')}
      subtitle={t('auth.verify_reset_code_subtitle')}
    >
      <VerifyResetOtp />
    </AuthLayout>
  );
}

export default function VerifyResetOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#00B1C5] border-t-transparent animate-spin" /></div>}>
      <VerifyResetOtpContent />
    </Suspense>
  );
}
