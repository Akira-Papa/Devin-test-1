import { NextResponse } from 'next/server';
import { ContactRepository } from '@/repositories/ContactRepository';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received contact form data:', body);

    const repository = ContactRepository.getInstance();
    const contact = await repository.save(body);
    console.log('Saved contact:', contact);

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json(
      { error: 'Failed to save contact', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
