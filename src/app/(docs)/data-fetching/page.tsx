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
  title: 'データフェッチング | Next.js ドキュメント',
  description: 'Next.jsにおけるデータフェッチングの方法と、サーバーコンポーネントでのデータ取得について解説します。',
}

export default function DataFetchingPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        データフェッチング
      </Typography>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          サーバーコンポーネントでのデータ取得
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Next.js 13以降では、Reactのサーバーコンポーネントを使用して、
          より効率的にデータを取得できます：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// app/users/page.tsx
async function getUsers() {
  const res = await fetch('https://api.example.com/users')
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          データ取得の方法
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                サーバーサイド
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="fetch APIの使用"
                    secondary="ネイティブfetch関数でデータを取得"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="データベースクエリ"
                    secondary="ORMやSQLを直接使用"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="キャッシュの活用"
                    secondary="自動的なデータキャッシング"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                クライアントサイド
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="SWR"
                    secondary="リアルタイムデータの取得に最適"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="React Query"
                    secondary="高度なキャッシュと状態管理"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="useEffect"
                    secondary="従来のReactデータフェッチング"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          SWRの使用例
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          リアルタイムデータの取得には、SWRライブラリの使用を推奨します：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`'use client'

import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Profile() {
  const { data, error, isLoading } = useSWR(
    '/api/user',
    fetcher
  )

  if (error) return <div>エラーが発生しました</div>
  if (isLoading) return <div>読み込み中...</div>

  return (
    <div>
      <h1>{data.name}さん、こんにちは！</h1>
      <p>メール: {data.email}</p>
    </div>
  )
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section">
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          データ取得のベストプラクティス
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="適切なキャッシュ戦略の選択"
              secondary="force-cache, no-store, revalidateの使い分け"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="エラーハンドリング"
              secondary="try-catchブロックでエラーを適切に処理"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="ローディング状態の表示"
              secondary="loading.tsxやSuspenseの活用"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="並列データフェッチ"
              secondary="Promise.allを使用した複数データの同時取得"
            />
          </ListItem>
        </List>
      </Box>
    </Container>
  )
}
