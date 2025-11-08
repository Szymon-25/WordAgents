'use client';

import { useState } from 'react';
import { GameParams } from '@/types';
import { getShareUrl, copyToClipboard } from '@/lib/utils';

interface ShareLinkProps {
  params: GameParams;
}

export default function ShareLink({ params }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = getShareUrl(params);
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const masterUrl = getShareUrl({ ...params, role: 'master' });
  const guesserUrl = getShareUrl({ ...params, role: 'guesser' });

  const handleCopyRole = async (url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          {copied ? '✓ Copied!' : '📋 Copy Current Link'}
        </button>
      </div>

      <details className="bg-gray-100 rounded-lg p-3">
        <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
          📤 Share specific role links
        </summary>
        <div className="mt-3 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Master Link:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={masterUrl}
                readOnly
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => handleCopyRole(masterUrl)}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
              >
                Copy
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guesser Link:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={guesserUrl}
                readOnly
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => handleCopyRole(guesserUrl)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
