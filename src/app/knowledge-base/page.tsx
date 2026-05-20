'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Source {
  id: string;
  title: string;
  category: string;
}

export default function KnowledgeBase() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setAnswer('');
    setSources([]);

    try {
      const res = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAnswer(`Error: ${data.error || 'Terjadi kesalahan'}`);
        return;
      }

      setAnswer(data.reply);
      setSources(data.sources || []);
    } catch (error) {
      setAnswer('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    'Bagaimana cara mengajukan cuti?',
    'Berapa hari WFH yang diperbolehkan?',
    'Apa saja benefit karyawan?',
    'Bagaimana prosedur resign?',
    'Kebijakan password perusahaan?',
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Knowledge Base
        </h2>
        <p className="text-gray-400">
          Tanyakan tentang kebijakan, SOP, dan prosedur perusahaan
        </p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Contoh: Bagaimana cara mengajukan cuti?"
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
            suppressHydrationWarning
          >
            {loading ? 'Mencari...' : 'Cari'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Contoh pertanyaan:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(ex);
              }}
              className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="bg-gray-800 rounded-lg p-6 flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Mencari di knowledge base...</p>
        </div>
      )}

      {answer && !loading && (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-purple-400">Jawaban</h3>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {answer}
              </ReactMarkdown>
            </div>
          </div>

          {sources.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-green-400">
                Sumber Dokumen ({sources.length})
              </h3>
              <div className="space-y-2">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between bg-gray-700 px-4 py-2 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{source.title}</p>
                      <p className="text-sm text-gray-400">{source.category}</p>
                    </div>
                    <span className="bg-purple-600 px-2 py-1 rounded text-xs">
                      {source.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
