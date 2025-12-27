'use client';

import { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';

interface ScanFormProps {
  onScanComplete?: (result: unknown, scanId: string) => void;
  onScanStart?: () => void;
  initialUrl?: string;
}

export function ScanForm({ onScanComplete, onScanStart, initialUrl = '' }: ScanFormProps) {
  const [url, setUrl] = useState(initialUrl);
  const [email, setEmail] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side URL validation
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please enter a website URL');
      return;
    }

    // Basic URL format check
    const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i;
    if (!urlPattern.test(trimmedUrl)) {
      setError('Please enter a valid website URL (e.g., example.com)');
      return;
    }

    setIsScanning(true);
    onScanStart?.();

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, email: email || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      onScanComplete?.(data.result, data.scanId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan URL');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-gray-900 mb-2">
            Website URL
          </label>
          <div className="relative">
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isScanning}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
            Email (optional - get report sent to you)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isScanning}
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isScanning || !url}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Scan for WCAG Issues
            </>
          )}
        </button>
      </div>

      <p className="text-center text-gray-600 text-sm mt-4">
        Free scan. No signup required. Results in under 30 seconds.
      </p>
    </form>
  );
}
