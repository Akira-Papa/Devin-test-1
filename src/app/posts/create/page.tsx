'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MainLayout from '../../../components/layout/MainLayout';

export default function CreatePost() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');

  if (status === 'loading') {
    return (
      <MainLayout>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin?callbackUrl=/posts/create');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('投稿内容を入力してください');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          media,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '投稿の作成に失敗しました');
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMedia = () => {
    if (mediaUrl && !media.includes(mediaUrl)) {
      setMedia([...media, mediaUrl]);
      setMediaUrl('');
    }
  };

  const removeMedia = (url: string) => {
    setMedia(media.filter((item) => item !== url));
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold mb-4">新しい投稿を作成</h1>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={5}
              placeholder="今何してる？"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
            ></textarea>
            <div className="text-right text-sm text-gray-500">
              {content.length}/500
            </div>
          </div>

          {media.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              {media.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="rounded-lg w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    onClick={() => removeMedia(url)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mb-4 flex">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="画像URLを追加（オプション）"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
            />
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-lg hover:bg-gray-300"
              onClick={addMedia}
            >
              追加
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? '投稿中...' : '投稿する'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
