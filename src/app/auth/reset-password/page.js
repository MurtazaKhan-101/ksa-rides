"use client";

import { Suspense } from "react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import ResetPassword from "../../components/authentication/resetPassword";
import { useTranslation } from "../../../lib/i18n";

function ResetPasswordContent() {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.create_new_password_title')}
      subtitle={t('auth.create_new_password_subtitle')}
    >
      <ResetPassword />
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#00B1C5] border-t-transparent animate-spin" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
