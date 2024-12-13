import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config/auth.config';
import { PromptRepository } from '../../../repositories/PromptRepository';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const repository = PromptRepository.getInstance();
  const prompts = await repository.getPromptsByUserId(session.user.id);
  return NextResponse.json(prompts);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const { content } = await request.json();
  const repository = PromptRepository.getInstance();
  const prompt = await repository.createPrompt(session.user.id, content);
  return NextResponse.json(prompt);
}
