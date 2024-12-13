import { Prompt, IPrompt } from '@/models/Prompt';

export class PromptRepository {
  private static instance: PromptRepository;

  public static getInstance(): PromptRepository {
    if (!PromptRepository.instance) {
      PromptRepository.instance = new PromptRepository();
    }
    return PromptRepository.instance;
  }

  async createPrompt(userId: string, content: string): Promise<IPrompt> {
    return await Prompt.create({ userId, content });
  }

  async getPromptsByUserId(userId: string): Promise<IPrompt[]> {
    return await Prompt.find({ userId }).sort({ createdAt: -1 });
  }

  async updatePrompt(id: string, content: string): Promise<IPrompt | null> {
    return await Prompt.findByIdAndUpdate(
      id,
      { content, updatedAt: new Date() },
      { new: true }
    );
  }

  async deletePrompt(id: string): Promise<boolean> {
    const result = await Prompt.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
