import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface PostCardProps {
  post: {
    _id: string;
    content: string;
    author?: {
      _id: string;
      name: string;
      username: string;
      image?: string;
    };
    media?: string[];
    likes: string[];
    createdAt: string;
    commentCount: number;
    isLiked: boolean;
  };
  onLike?: (postId: string) => void;
}

const PostCard = ({ post, onLike }: PostCardProps) => {
  const { data: session } = useSession();
  const formattedDate = new Date(post.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleLike = () => {
    if (onLike) {
      onLike(post._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-start space-x-3">
        {post.author ? (
          <>
            <Link href={`/profile/${post.author.username}`}>
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {post.author.image ? (
                  <img
                    src={post.author.image}
                    alt={post.author.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-500">
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
                <span className="text-gray-400 text-sm ml-2">・{formattedDate}</span>
              </div>
              <div className="mt-1">
                <Link href={`/posts/${post._id}`}>
                  <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
                </Link>
                {post.media && post.media.length > 0 && (
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {post.media.map((url, index) => (
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
              <div className="mt-3 flex items-center space-x-6">
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
                  <span>{post.likes?.length || 0}</span>
                </button>
                <Link
                  href={`/posts/${post._id}`}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500"
                >
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
                  <span>{post.commentCount}</span>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium text-gray-900">不明なユーザー</span>
              <span className="text-gray-400 text-sm ml-2">・{formattedDate}</span>
            </div>
            <div className="mt-1">
              <Link href={`/posts/${post._id}`}>
                <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
              </Link>
              {post.media && post.media.length > 0 && (
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {post.media.map((url, index) => (
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
            <div className="mt-3 flex items-center space-x-6">
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
                <span>{post.likes?.length || 0}</span>
              </button>
              <Link
                href={`/posts/${post._id}`}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500"
              >
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
                <span>{post.commentCount}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
