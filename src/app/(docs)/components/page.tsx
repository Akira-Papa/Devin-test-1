import type { Metadata } from 'next'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Container from '@mui/material/Container'

export const metadata: Metadata = {
  title: 'コンポーネント | Next.js ドキュメント',
  description: 'Next.jsにおけるReactコンポーネントの基礎と実装方法について解説します。',
}

export default function ComponentsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Reactコンポーネントの基礎
      </Typography>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          コンポーネントとは
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Reactコンポーネントは、UIの再利用可能な部品です。
          Next.jsでは、以下の2種類のコンポーネントを使用できます：
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="サーバーコンポーネント（デフォルト）" />
          </ListItem>
          <ListItem>
            <ListItemText primary="クライアントコンポーネント" />
          </ListItem>
        </List>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          サーバーコンポーネント
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          App Routerでは、すべてのコンポーネントがデフォルトでサーバーコンポーネントとして動作します：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// app/components/ServerComponent.tsx
export default function ServerComponent() {
  return (
    <div>
      <h2>サーバーコンポーネント</h2>
      <p>このコンポーネントはサーバーでレンダリングされます</p>
    </div>
  )
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          クライアントコンポーネント
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          インタラクティブな機能が必要な場合は、'use client'ディレクティブを使用します：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`'use client'

// app/components/ClientComponent.tsx
import { useState } from 'react'

export default function ClientComponent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h2>クライアントコンポーネント</h2>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        増やす
      </button>
    </div>
  )
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section">
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          コンポーネントの使い分け
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          以下の場合にそれぞれのコンポーネントを使用することをお勧めします：
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                サーバーコンポーネント
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="データベースへの直接アクセス" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="機密情報の利用" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="大きな依存関係の使用" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="SEO対策が必要な場合" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                クライアントコンポーネント
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="イベントリスナーの使用" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="状態管理の必要性" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="ブラウザAPIの使用" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="クリックなどのインタラクション" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
