import { Prompt, IPrompt } from '@/models/Prompt';
import { EventEmitter } from 'events';

export class PromptRepository {
  private static instance: PromptRepository;
  private eventEmitter: EventEmitter;

  private constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public static getInstance(): PromptRepository {
    if (!PromptRepository.instance) {
      PromptRepository.instance = new PromptRepository();
    }
    return PromptRepository.instance;
  }

  public subscribe(callback: (event: string, data: any) => void) {
    this.eventEmitter.on('promptsUpdated', callback);
    return () => this.eventEmitter.off('promptsUpdated', callback);
  }

  async createPrompt(userId: string, content: string): Promise<IPrompt> {
    const prompt = await Prompt.create({ userId, content });
    this.eventEmitter.emit('promptsUpdated', { type: 'create', prompt });
    return prompt;
  }

  async getPromptsByUserId(userId: string): Promise<IPrompt[]> {
    return await Prompt.find({ userId }).sort({ createdAt: -1 });
  }

  async updatePrompt(id: string, content: string): Promise<IPrompt | null> {
    const prompt = await Prompt.findByIdAndUpdate(
      id,
      { content, updatedAt: new Date() },
      { new: true }
    );
    if (prompt) {
      this.eventEmitter.emit('promptsUpdated', { type: 'update', prompt });
    }
    return prompt;
  }

  async deletePrompt(id: string): Promise<boolean> {
    const result = await Prompt.deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      this.eventEmitter.emit('promptsUpdated', { type: 'delete', promptId: id });
    }
    return result.deletedCount === 1;
  }
}
