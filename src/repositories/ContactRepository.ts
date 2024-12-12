import { Contact, IContact } from '../models/Contact';
import mongoose from 'mongoose';

export class ContactRepository {
  private static instance: ContactRepository;

  private constructor() {
    // Initialize MongoDB connection with error handling
    const MONGODB_URI = 'mongodb://127.0.0.1:27017/test1';
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
