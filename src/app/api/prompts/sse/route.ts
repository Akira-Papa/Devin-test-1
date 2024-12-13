import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config/auth.config';
import { PromptRepository } from '@/repositories/PromptRepository';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const repository = PromptRepository.getInstance();
    const encoder = new TextEncoder();
    let isConnectionClosed = false;

    const response = new Response(
      new ReadableStream({
        start(controller) {
          // Subscribe to prompt updates
          const unsubscribe = repository.subscribe((event: string, data: any) => {
            if (!isConnectionClosed) {
              try {
                const message = `data: ${JSON.stringify(data)}\n\n`;
                controller.enqueue(encoder.encode(message));
              } catch (error) {
                console.error('Error sending SSE message:', error);
              }
            }
          });

          // Keep connection alive with heartbeat
          const interval = setInterval(() => {
            if (!isConnectionClosed) {
              try {
                controller.enqueue(encoder.encode(':\n\n'));
              } catch (error) {
                console.error('Error sending heartbeat:', error);
                clearInterval(interval);
              }
            }
          }, 30000);

          // Cleanup on connection close
          return () => {
            isConnectionClosed = true;
            clearInterval(interval);
            unsubscribe();
            try {
              controller.close();
            } catch (error) {
              console.error('Error closing controller:', error);
            }
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
