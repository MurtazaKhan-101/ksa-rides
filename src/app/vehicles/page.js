"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
function VehiclesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.get("vehicle")) {
      params.set("vehicle", "hyundai-grand-starex");
    }

    router.replace(`/vehicles/extras?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-10 h-10 mx-auto rounded-full border-2 border-[#00B1C5] border-t-transparent animate-spin mb-3" />
        <p className="text-sm text-gray-600">Continuing to booking extras...</p>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#00B1C5] border-t-transparent animate-spin" />
        </div>
      }
    >
      <VehiclesContent />
    </Suspense>
  );
}
