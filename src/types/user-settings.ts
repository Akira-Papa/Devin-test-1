import { z } from 'zod';

export const userSettingsSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  language: z.enum(['ja', 'en']).default('ja'),
  emailNotifications: z.boolean().default(true),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
});

export type UserSettings = z.infer<typeof userSettingsSchema>;
