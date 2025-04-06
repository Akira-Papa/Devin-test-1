'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MainLayout from '../../../components/layout/MainLayout';
import Link from 'next/link';

interface Comment {
  _id: string;
  content: string;
  author: {
    _id?: string;
    name: string;
    username?: string;
    image?: string;
    isAI?: boolean;
    aiCharacter?: string;
  };
  createdAt: string;
}

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const postId = params.postId as string;

  useEffect(() => {
    if (postId) {
      fetchPostAndComments();
    }
  }, [postId]);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      
      const postRes = await fetch(`/api/posts/${postId}`);
      if (!postRes.ok) {
        throw new Error('投稿の取得に失敗しました');
      }
      const postData = await postRes.json();
      setPost(postData);
      
      const commentsRes = await fetch(`/api/posts/${postId}/comments`);
      if (!commentsRes.ok) {
        throw new Error('コメントの取得に失敗しました');
      }
      const commentsData = await commentsRes.json();
      setComments(commentsData);
    } catch (error) {
      console.error('データ取得エラー:', error);
      setError('データの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });

      if (res.ok) {
        const { liked } = await res.json();
        setPost((prev: any) => ({
          ...prev,
          isLiked: liked,
          likes: liked
            ? [...prev.likes, (session.user as any).id]
            : prev.likes.filter((id: string) => id !== (session.user as any).id),
        }));
      }
    } catch (error) {
      console.error('いいね処理エラー:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    if (!commentContent.trim()) {
      return;
    }
    
    try {
      setSubmitting(true);
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentContent }),
      });
      
      if (!res.ok) {
        throw new Error('コメントの投稿に失敗しました');
      }
      
      await fetchPostAndComments();
      setCommentContent('');
    } catch (error) {
      console.error('コメント投稿エラー:', error);
      setError('コメントの投稿中にエラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (!post) {
    return (
      <MainLayout>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">投稿が見つかりません</h3>
          <p className="text-gray-500 mb-4">
            お探しの投稿は削除されたか、存在しない可能性があります。
          </p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-500">
            ホームに戻る
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        {/* 投稿詳細 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start space-x-3">
            <Link href={`/profile/${post.author.username}`}>
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {post.author.image ? (
                  <img
                    src={post.author.image}
                    alt={post.author.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-500">
                    {post.author.name.charAt(0)}
                  </span>
                )}
              </div>
            </Link>
            <div className="flex-1">
              <div className="flex items-center">
                <Link href={`/profile/${post.author.username}`} className="font-medium text-gray-900 hover:underline">
                  {post.author.name}
                </Link>
                <span className="text-gray-500 text-sm ml-2">@{post.author.username}</span>
                <span className="text-gray-400 text-sm ml-2">・{formatDate(post.createdAt)}</span>
              </div>
              <div className="mt-2">
                <p className="text-gray-800 whitespace-pre-line text-lg">{post.content}</p>
                {post.media && post.media.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {post.media.map((url: string, index: number) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Media ${index + 1}`}
                        className="rounded-lg max-h-96 w-auto object-contain"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center space-x-6 border-t border-gray-100 pt-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 text-sm ${
                    post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                  disabled={!session}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill={post.isLiked ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={post.isLiked ? 0 : 1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{post.likes.length}</span>
                </button>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>{comments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* コメント入力フォーム */}
        {session && (
          <div className="bg-white rounded-lg shadow p-4">
            <form onSubmit={handleSubmitComment}>
              <div className="flex space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || ''}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-500">
                      {session.user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={2}
                    placeholder="コメントを入力..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    maxLength={300}
                  ></textarea>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{commentContent.length}/300</span>
                    <button
                      type="submit"
                      disabled={submitting || !commentContent.trim()}
                      className="bg-indigo-600 text-white px-4 py-1 rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {submitting ? '送信中...' : 'コメント'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* コメント一覧 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">コメント</h3>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex space-x-3 pb-4 border-b border-gray-100 last:border-0">
                  {comment.author.isAI ? (
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <span className="text-sm font-medium text-indigo-600">
                        {comment.author.name.charAt(0)}
                      </span>
                    </div>
                  ) : (
                    <Link href={`/profile/${comment.author.username}`}>
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {comment.author.image ? (
                          <img
                            src={comment.author.image}
                            alt={comment.author.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-500">
                            {comment.author.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    </Link>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center">
                      {comment.author.isAI ? (
                        <span className="font-medium text-indigo-600">
                          {comment.author.name}
                          <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                            {comment.author.aiCharacter}
                          </span>
                        </span>
                      ) : (
                        <Link href={`/profile/${comment.author.username}`} className="font-medium text-gray-900 hover:underline">
                          {comment.author.name}
                        </Link>
                      )}
                      <span className="text-gray-400 text-sm ml-2">・{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-gray-800">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">まだコメントはありません。最初のコメントを投稿しましょう！</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
