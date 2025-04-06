import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { label: 'ホーム', href: '/', active: pathname === '/' },
    { label: '探索', href: '/explore', active: pathname === '/explore' },
    { label: 'プロフィール', href: `/profile/${(session?.user as any)?.username || ''}`, active: pathname?.startsWith('/profile') },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-indigo-600">
                  SNS Portal
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {session ? (
                <div className="flex items-center space-x-4">
                  <Link href="/posts/create" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                    投稿する
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ログアウト
                  </button>
                  <Link href={`/profile/${(session.user as any)?.username || ''}`}>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
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
                  </Link>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link href="/auth/signin" className="text-gray-500 hover:text-gray-700">
                    ログイン
                  </Link>
                  <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                    登録
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* サイドナビゲーション（ログイン時のみ表示） */}
          {session && (
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white shadow rounded-lg p-4 sticky top-20">
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-3 py-2 rounded-md ${
                        item.active
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* コンテンツエリア */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
