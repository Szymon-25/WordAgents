'use client';

import { useState } from 'react';
import { GameParams } from '@/types';
import { getShareUrl, copyToClipboard } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ShareLinkProps {
  params: GameParams;
  seed: string;
}

export default function ShareLink({ params, seed }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = getShareUrl({ ...params, seed });
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const masterUrl = getShareUrl({ ...params, seed, role: 'master' });
  const guesserUrl = getShareUrl({ ...params, seed, role: 'guesser' });

  const handleCopyRole = async (url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      {/* <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={handleCopy}
          variant="default"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          {copied ? '✓ Copied!' : '📋 Copy Current Link'}
        </Button>
      </div> */}

      <details className="bg-slate-50 rounded-lg p-3 border">
        <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900 text-sm">
          📤 Share specific role links
        </summary>
        <div className="mt-3 space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Spymaster Link:
            </label>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Input
                type="text"
                value={masterUrl}
                readOnly
                className="w-full text-[10px] sm:text-xs truncate"
              />
              <Button
                onClick={() => handleCopyRole(masterUrl)}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
              >
                Copy
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Guesser Link:
            </label>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Input
                type="text"
                value={guesserUrl}
                readOnly
                className="w-full text-[10px] sm:text-xs truncate"
              />
              <Button
                onClick={() => handleCopyRole(guesserUrl)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
