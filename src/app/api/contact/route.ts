import { NextResponse } from 'next/server';
import { ContactRepository } from '@/repositories/ContactRepository';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const repository = ContactRepository.getInstance();
    const contact = await repository.save(body);
    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save contact' }, { status: 500 });
  }
}
