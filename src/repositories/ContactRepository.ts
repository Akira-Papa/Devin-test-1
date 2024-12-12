import { Contact, IContact } from '../models/Contact';
import mongoose from 'mongoose';

export class ContactRepository {
  private static instance: ContactRepository;

  private constructor() {
    // Initialize MongoDB connection
    const MONGODB_URI = 'mongodb://localhost:27017/test1';
    mongoose.connect(MONGODB_URI);
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
