import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config/auth.config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const response = new Response(
      new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();

          // Keep connection alive with heartbeat
          const interval = setInterval(() => {
            controller.enqueue(encoder.encode(':\n\n'));
          }, 30000);

          // Cleanup on connection close
          return () => {
            clearInterval(interval);
          };
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    );

    return response;
  } catch (error) {
    console.error('SSE error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
