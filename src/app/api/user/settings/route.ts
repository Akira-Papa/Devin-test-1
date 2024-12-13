import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/config/auth.config';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { userSettingsSchema } from '@/types/user-settings';

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('認証が必要です', { status: 401 });
  }

  try {
    const data = await req.json();
    const validatedData = userSettingsSchema.parse(data);

    const client = await clientPromise;
    const usersCollection = client.db().collection('users');

    await usersCollection.updateOne(
      { _id: session.user.id },
      { $set: validatedData }
    );

    return NextResponse.json({ message: '設定を更新しました' });
  } catch (error) {
    console.error('Settings update error:', error);
    return new NextResponse('設定の更新に失敗しました', { status: 400 });
  }
}
