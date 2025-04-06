'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MainLayout from '../../../components/layout/MainLayout';
import PostCard from '../../../components/posts/PostCard';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    posts: 0,
  });
  const [error, setError] = useState('');

  const username = params.username as string;

  useEffect(() => {
    if (username) {
      fetchUserData();
      fetchUserPosts();
      if (session?.user) {
        checkFollowStatus();
      }
    }
  }, [username, session]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${username}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setError('ユーザーが見つかりません');
          return;
        }
        throw new Error('ユーザー情報の取得に失敗しました');
      }
      
      const data = await res.json();
      setUser(data.user);
      setStats({
        followers: data.followersCount,
        following: data.followingCount,
        posts: data.postsCount,
      });
    } catch (error) {
      console.error('ユーザーデータ取得エラー:', error);
      setError('ユーザー情報の取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`/api/posts?userId=${username}`);
      
      if (!res.ok) {
        throw new Error('投稿の取得に失敗しました');
      }
      
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('投稿取得エラー:', error);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const res = await fetch(`/api/users/${username}/follow`);
      
      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following);
      }
    } catch (error) {
      console.error('フォロー状態確認エラー:', error);
    }
  };

  const handleFollow = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    try {
      const res = await fetch(`/api/users/${username}/follow`, {
        method: 'POST',
      });
      
      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following);
        
        setStats((prev) => ({
          ...prev,
          followers: data.following ? prev.followers + 1 : prev.followers - 1,
        }));
      }
    } catch (error) {
      console.error('フォロー処理エラー:', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

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
      console.error('いいね処理エラー:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !user) {
    return (
      <MainLayout>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || 'ユーザーが見つかりません'}
          </h3>
          <p className="text-gray-500 mb-4">
            お探しのユーザーは存在しないか、削除された可能性があります。
          </p>
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            ホームに戻る
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* プロフィールヘッダー */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="h-32 bg-indigo-600"></div>
          <div className="px-6 py-4 relative">
            <div className="absolute -top-12 left-6">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-medium text-gray-500">
                    {user.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-12">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-500">@{user.username}</p>
                </div>
                {session && (session.user as any).username !== user.username && (
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      following
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {following ? 'フォロー中' : 'フォローする'}
                  </button>
                )}
              </div>
              {user.bio && (
                <p className="mt-3 text-gray-700">{user.bio}</p>
              )}
              <div className="mt-4 flex space-x-4">
                <div>
                  <span className="font-bold text-gray-900">{stats.posts}</span>{' '}
                  <span className="text-gray-500">投稿</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">{stats.followers}</span>{' '}
                  <span className="text-gray-500">フォロワー</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">{stats.following}</span>{' '}
                  <span className="text-gray-500">フォロー中</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 投稿一覧 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">投稿</h2>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id} post={post} onLike={handleLike} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">まだ投稿がありません</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
