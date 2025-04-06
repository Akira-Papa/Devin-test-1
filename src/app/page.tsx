'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MainLayout from '../components/layout/MainLayout';
import PostCard from '../components/posts/PostCard';

export default function Home() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState<'all' | 'following'>('all');

  useEffect(() => {
    fetchPosts();
  }, [session, feedType]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url = `/api/posts${feedType === 'following' ? '?followingOnly=true' : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('投稿の取得に失敗しました', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!session) return;

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });

      if (res.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              const isLiked = !post.isLiked;
              const likesCount = isLiked
                ? [...post.likes, (session.user as any).id]
                : post.likes.filter((id: string) => id !== (session.user as any).id);

              return {
                ...post,
                isLiked,
                likes: likesCount,
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error('いいね処理に失敗しました', error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        {session && (
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex space-x-4 mb-4">
              <button
                className={`flex-1 py-2 rounded-md ${
                  feedType === 'all'
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setFeedType('all')}
              >
                すべての投稿
              </button>
              <button
                className={`flex-1 py-2 rounded-md ${
                  feedType === 'following'
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setFeedType('following')}
              >
                フォロー中
              </button>
            </div>
          </div>
        )}

        {status === 'loading' || loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onLike={handleLike} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">投稿がありません</h3>
            <p className="text-gray-500">
              {feedType === 'following'
                ? 'フォローしているユーザーの投稿がまだありません。ユーザーをフォローするか、表示タイプを変更してください。'
                : '投稿がまだありません。最初の投稿を作成しましょう！'}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
