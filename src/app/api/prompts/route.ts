import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config/auth.config';
import { PromptRepository } from '../../../repositories/PromptRepository';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // Ensure MongoDB is connected
    const client = await clientPromise;
    const db = client.db();
    console.log('MongoDB connected successfully');

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log('No authenticated user found');
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    console.log('Fetching prompts for user:', session.user.id);
    const repository = PromptRepository.getInstance();
    const prompts = await repository.getPromptsByUserId(session.user.id);
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error in GET /api/prompts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Ensure MongoDB is connected
    const client = await clientPromise;
    const db = client.db();
    console.log('MongoDB connected successfully');

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log('No authenticated user found');
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const { content } = await request.json();
    console.log('Creating prompt for user:', session.user.id);
    const repository = PromptRepository.getInstance();
    const prompt = await repository.createPrompt(session.user.id, content);
    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error in POST /api/prompts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
