"use client";

import { useState } from 'react';

export default function JSCode({ code }: { code: string }) {

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = async () => {
    setIsCopied(true);
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(code);
    }
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className='bg-gray-100 p-4 rounded-md mb-4 relative'>
      <button className='absolute transition top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded p-1 text-xs flex flex-row-reverse gap-2 items-center cursor-pointer' onClick={() => copyToClipboard()}>
        { isCopied && <div className='absolute right-8 text-xs text-gray-700 transition'>Copied!</div>}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
      <pre className="overflow-auto">{code}</pre>
    </div>
  );
}
