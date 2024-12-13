import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { userSettingsSchema } from '@/types/user-settings';
import { ObjectId } from 'mongodb';
import { NextAuthService } from '@/lib/auth/NextAuthService';

export async function PUT(req: Request) {
  try {
    const user = await NextAuthService.requireAuth();
    const data = await req.json();
    const validatedData = userSettingsSchema.parse(data);

    const client = await clientPromise;
    const usersCollection = client.db().collection('users');

    await usersCollection.updateOne(
      { _id: new ObjectId(user.id) },
      { $set: validatedData }
    );

    return NextResponse.json({ message: '設定を更新しました' });
  } catch (error) {
    console.error('Settings update error:', error);
    if (error instanceof Error && error.message === '認証が必要です') {
      return NextAuthService.createUnauthorizedResponse();
    }
    return new NextResponse('設定の更新に失敗しました', { status: 400 });
  }
}
