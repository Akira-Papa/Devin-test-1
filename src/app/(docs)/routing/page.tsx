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
  title: 'ルーティング | Next.js ドキュメント',
  description: 'Next.jsのApp RouterとPages Routerの使い方、ルーティングの基本概念について解説します。',
}

export default function RoutingPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Next.jsのルーティング
      </Typography>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          App Router
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          App Routerは、Next.js 13以降で導入された新しいルーティングシステムです。
          React Server Componentsを活用し、より柔軟なルーティングを実現します：
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="ファイルシステムベースのルーティング" />
          </ListItem>
          <ListItem>
            <ListItemText primary="ネストされたレイアウト" />
          </ListItem>
          <ListItem>
            <ListItemText primary="ローディング状態の制御" />
          </ListItem>
          <ListItem>
            <ListItemText primary="エラーハンドリング" />
          </ListItem>
        </List>

        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`app/
├── layout.tsx      # ルートレイアウト
├── page.tsx        # ホームページ
├── about/
│   └── page.tsx    # /about ページ
└── blog/
    ├── layout.tsx  # ブログ用レイアウト
    └── [slug]/     # 動的ルーティング
        └── page.tsx`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          Pages Router
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          従来のPages Routerは、シンプルで直感的なルーティングを提供します：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`pages/
├── index.tsx       # ホームページ
├── about.tsx       # /about ページ
└── blog/
    ├── index.tsx   # /blog ページ
    └── [slug].tsx  # 動的ルーティング`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section">
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          ルーティングの比較
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                App Router
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Server Components対応"
                    secondary="デフォルトでサーバーサイドレンダリング"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="レイアウトのネスト"
                    secondary="複数のレイアウトを組み合わせ可能"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="並列ルート"
                    secondary="複数のページを同時に表示可能"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                Pages Router
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="シンプルな構造"
                    secondary="従来のファイルベースルーティング"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="APIルート統合"
                    secondary="api/ディレクトリで簡単にAPI作成"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="getStaticProps対応"
                    secondary="静的サイト生成に最適"
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
