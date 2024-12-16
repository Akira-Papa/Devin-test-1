import { Prompt, IPrompt } from '@/models/Prompt'
import mongoose from 'mongoose'

export class PromptRepository {
    private static instance: PromptRepository
    private isConnected: boolean = false

    public static getInstance(): PromptRepository {
        if (!PromptRepository.instance) {
            PromptRepository.instance = new PromptRepository()
        }
        return PromptRepository.instance
    }

    private async ensureConnection() {
        if (!this.isConnected) {
            if (mongoose.connection.readyState !== 1) {
                await mongoose.connect(process.env.MONGODB_URI!)
            }
            this.isConnected = true
        }
    }

    async createPrompt(userId: string, content: string): Promise<IPrompt> {
        try {
            await this.ensureConnection()
            const startTime = Date.now()

            const prompt = await Prompt.create({
                userId,
                content,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            const duration = Date.now() - startTime
            if (duration > 1000) {
                console.warn(`Prompt creation took ${duration}ms`)
            }

            return prompt
        } catch (error) {
            console.error('Failed to create prompt:', error)
            throw error
        }
    }

    async getPromptsByUserId(userId: string): Promise<IPrompt[]> {
        try {
            await this.ensureConnection()
            const prompts = await Prompt.find({ userId })
                .sort({ createdAt: -1 })
                .lean<IPrompt[]>()
                .limit(100)
            return prompts
        } catch (error) {
            console.error('Failed to get prompts:', error)
            throw error
        }
    }

    async updatePrompt(id: string, content: string): Promise<IPrompt | null> {
        try {
            await this.ensureConnection()
            return await Prompt.findByIdAndUpdate(
                id,
                {
                    content,
                    updatedAt: new Date(),
                },
                {
                    new: true,
                    lean: true,
                }
            ).lean<IPrompt>()
        } catch (error) {
            console.error('Failed to update prompt:', error)
            throw error
        }
    }

    async deletePrompt(id: string): Promise<boolean> {
        try {
            await this.ensureConnection()
            const result = await Prompt.deleteOne({ _id: id })
            return result.deletedCount === 1
        } catch (error) {
            console.error('Failed to delete prompt:', error)
            throw error
        }
    }
}
