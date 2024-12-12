import { Contact, IContact } from '../models/Contact';
import mongoose from 'mongoose';

export class ContactRepository {
  private static instance: ContactRepository;

  private constructor() {
    // Initialize MongoDB connection with error handling
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    mongoose.connect(MONGODB_URI)
      .then(() => console.log('MongoDB connected successfully'))
      .catch(err => console.error('MongoDB connection error:', err));

    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
  }

  public static getInstance(): ContactRepository {
    if (!ContactRepository.instance) {
      ContactRepository.instance = new ContactRepository();
    }
    return ContactRepository.instance;
  }

  async save(contactData: Omit<IContact, '_id' | 'createdAt'>): Promise<IContact> {
    const contact = new Contact(contactData);
    return await contact.save();
  }
}
