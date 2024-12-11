import type { Metadata } from 'next'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Container from '@mui/material/Container'

export const metadata: Metadata = {
  title: 'はじめに | Next.js ドキュメント',
  description: 'Next.jsの基本概念と環境構築について学びましょう。初心者向けの分かりやすい解説です。',
}

export default function GettingStartedPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Next.jsをはじめよう
      </Typography>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          Next.jsとは？
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Next.jsは、Reactベースのフルスタックフレームワークです。
          高速なWebアプリケーションを構築するための様々な機能を提供します：
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="ページの高速な読み込み" />
          </ListItem>
          <ListItem>
            <ListItemText primary="サーバーサイドレンダリング（SSR）" />
          </ListItem>
          <ListItem>
            <ListItemText primary="静的サイト生成（SSG）" />
          </ListItem>
          <ListItem>
            <ListItemText primary="直感的なファイルベースのルーティング" />
          </ListItem>
          <ListItem>
            <ListItemText primary="APIルートの簡単な作成" />
          </ListItem>
        </List>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          環境構築
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Next.jsプロジェクトを始めるには、以下のコマンドを実行します：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`# create-next-appを使用して新しいプロジェクトを作成
npx create-next-app@latest my-app
cd my-app

# 開発サーバーを起動
npm run dev`}
          </Typography>
        </Paper>
        <Typography variant="body1" sx={{ mb: 2 }}>
          プロジェクト作成時には、以下のオプションが選択できます：
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="TypeScriptのサポート" />
          </ListItem>
          <ListItem>
            <ListItemText primary="ESLintの設定" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Tailwind CSSの導入" />
          </ListItem>
          <ListItem>
            <ListItemText primary="App RouterまたはPages Router" />
          </ListItem>
        </List>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          プロジェクト構造
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          基本的なNext.jsプロジェクトは以下のような構造になっています：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`my-app/
├── app/          # Appルーターを使用する場合
│   ├── layout.tsx
│   └── page.tsx
├── public/       # 静的ファイル
├── components/   # 再利用可能なコンポーネント
├── styles/       # CSSファイル
└── package.json  # 依存関係の管理`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section">
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          次のステップ
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          基本的な環境構築ができたら、次のトピックに進みましょう：
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Reactコンポーネントの基礎" />
          </ListItem>
          <ListItem>
            <ListItemText primary="ページのルーティング" />
          </ListItem>
          <ListItem>
            <ListItemText primary="データフェッチング" />
          </ListItem>
          <ListItem>
            <ListItemText primary="スタイリング手法" />
          </ListItem>
        </List>
      </Box>
    </Container>
  )
}
