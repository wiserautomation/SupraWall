import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0C10] text-[#C5C6C7] px-6">
      <div className="max-w-lg text-center">
        <div className="mb-8 inline-flex flex-col items-center">
          <span className="text-[120px] font-black leading-none text-[#1F2833] opacity-50">404</span>
          <div className="-mt-16 text-[#66FCF1] drop-shadow-[0_0_10px_rgba(102,252,241,0.5)]">
             <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white">
          Secure Fragment Not Found
        </h1>
        <p className="mb-10 text-lg text-[#8E9096]">
          The resource you are attempting to access does not exist or has been de-referenced 
          within the secure perimeter.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#66FCF1] px-8 py-4 text-sm font-bold text-[#0B0C10] transition-transform hover:scale-105 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Authorized Access
        </Link>
      </div>

      {/* Grid Pattern Background */}
      <div className="fixed inset-0 -z-10 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1F2833 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
    </div>
  );
}
