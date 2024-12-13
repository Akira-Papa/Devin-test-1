import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PromptRepository } from '../../../../repositories/PromptRepository';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const { content } = await request.json();
  const repository = PromptRepository.getInstance();
  const prompt = await repository.updatePrompt(params.id, content);
  return NextResponse.json(prompt);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const repository = PromptRepository.getInstance();
  const success = await repository.deletePrompt(params.id);
  return NextResponse.json({ success });
}
