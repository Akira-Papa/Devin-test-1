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
  title: 'デプロイメント | Next.js ドキュメント',
  description: 'Next.jsアプリケーションの本番環境へのデプロイ方法と、各種プラットフォームでのデプロイ手順について解説します。',
}

export default function DeploymentPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        デプロイメントガイド
      </Typography>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          本番用ビルド
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Next.jsアプリケーションを本番環境にデプロイする前の準備：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`# 本番用ビルドの作成
npm run build

# ビルド結果の確認
npm run start

# 環境変数の設定
NODE_ENV=production
DATABASE_URL=your_database_url
# その他の環境変数`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          Vercelへのデプロイ
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Vercelは、Next.jsの開発元が提供する最適化されたホスティングプラットフォームです：
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="GitHubとの連携"
              secondary="プッシュ時に自動デプロイ"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="プレビュー環境"
              secondary="PRごとに自動でプレビューURLを生成"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="環境変数の管理"
              secondary="Web UIで簡単に設定可能"
            />
          </ListItem>
        </List>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`# Vercel CLIのインストール
npm i -g vercel

# プロジェクトのデプロイ
vercel

# 本番環境へのデプロイ
vercel --prod`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          その他のプラットフォーム
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                AWS
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="AWS Amplify"
                    secondary="フルマネージドのホスティング"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Elastic Beanstalk"
                    secondary="スケーラブルな環境"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="EC2 + Docker"
                    secondary="カスタマイズ可能な環境"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                その他
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Netlify"
                    secondary="静的サイトに最適"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Google Cloud Run"
                    secondary="コンテナベースのデプロイ"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Heroku"
                    secondary="シンプルな操作性"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box component="section">
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          デプロイのベストプラクティス
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="環境変数の管理"
              secondary="本番環境の機密情報を適切に管理"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="静的アセットの最適化"
              secondary="画像やフォントの最適化"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="キャッシュ戦略"
              secondary="適切なキャッシュ設定"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="モニタリング"
              secondary="エラー監視とパフォーマンス計測"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="CI/CDパイプライン"
              secondary="自動テストと継続的デプロイ"
            />
          </ListItem>
        </List>
      </Box>
    </Container>
  )
}
