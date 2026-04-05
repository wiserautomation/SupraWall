'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0C10] text-[#C5C6C7] px-6">
      <div className="max-w-md text-center">
        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#1F2833] text-[#66FCF1] shadow-[0_0_20px_rgba(102,252,241,0.2)]">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          System Override
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-[#8E9096]">
          An unexpected protocol failure occurred. The guardrails caught a system exception. 
          Our engineers have been alerted.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg bg-[#66FCF1] px-5 py-3 text-sm font-semibold text-[#0B0C10] transition-colors hover:bg-[#45A29E]"
          >
            Re-initialize Protocol
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-[#1F2833] bg-transparent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1F2833]"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#66FCF1]/5 blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#45A29E]/5 blur-[120px]"></div>
      </div>
    </div>
  );
}
