'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BackofficePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/backoffice/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="text-xl text-gray-600">Redirigiendo...</div>
    </div>
  );
}
