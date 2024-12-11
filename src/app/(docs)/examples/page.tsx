import type { Metadata } from 'next'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

export const metadata: Metadata = {
  title: '実装例とベストプラクティス | Next.js ドキュメント',
  description: 'Next.jsの実装例とベストプラクティスを紹介し、実践的な開発手法について解説します。',
}

export default function ExamplesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        実装例とベストプラクティス
      </Typography>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          認証システムの実装
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Next.jsでの認証システムの実装例：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// app/auth/login/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    })

    if (result?.ok) {
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">ログイン</button>
    </form>
  )
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          データ取得と状態管理
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          SWRを使用した効率的なデータ取得と状態管理：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// hooks/useUser.ts
import useSWR from 'swr'
import type { User } from '@/types'

const fetcher = (url: string) =>
  fetch(url).then(res => res.json())

export function useUser(id: string) {
  const { data, error, isLoading } = useSWR<User>(
    \`/api/users/\${id}\`,
    fetcher
  )

  return {
    user: data,
    isLoading,
    isError: error
  }
}

// components/UserProfile.tsx
export default function UserProfile({ id }: { id: string }) {
  const { user, isLoading, isError } = useUser(id)

  if (isError) return <div>エラーが発生しました</div>
  if (isLoading) return <div>読み込み中...</div>

  return (
    <div>
      <h1>{user.name}さんのプロフィール</h1>
      <p>メール: {user.email}</p>
    </div>
  )
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          フォーム処理
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          React Hook Formを使用したフォーム実装：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// components/ContactForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  message: z.string().min(10, 'メッセージは10文字以上必要です')
})

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    // 送信後の処理
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <textarea {...register('message')} />
      {errors.message && <span>{errors.message.message}</span>}

      <button type="submit">送信</button>
    </form>
  )
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section">
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          ベストプラクティス集
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                パフォーマンス
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="画像の最適化"
                    secondary="next/imageの積極的な使用"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="コンポーネントの分割"
                    secondary="適切な粒度での分割"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="キャッシュ戦略"
                    secondary="データの特性に応じた設定"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                セキュリティ
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="入力検証"
                    secondary="サーバー側での必須チェック"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="認証・認可"
                    secondary="適切なミドルウェアの使用"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="CSRFトークン"
                    secondary="フォーム送信時の保護"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                保守性
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="型の活用"
                    secondary="TypeScriptの積極的な使用"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="テストの作成"
                    secondary="重要な機能のテスト網羅"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="エラー処理"
                    secondary="適切なエラーバウンダリ"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
