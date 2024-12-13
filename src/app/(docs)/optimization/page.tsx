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
  title: 'パフォーマンス最適化 | Next.js ドキュメント',
  description: 'Next.jsアプリケーションのパフォーマンス最適化手法について解説します。',
}

export default function OptimizationPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        パフォーマンス最適化
      </Typography>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          画像の最適化
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          next/imageコンポーネントを使用した画像の最適化：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`import Image from 'next/image'

export default function OptimizedImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="ヒーロー画像"
      width={1200}
      height={600}
      priority  // LCPの画像に設定
      quality={75}  // 画質の設定（デフォルト75）
    />
  )
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          ルートセグメントの設定
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ルートセグメントの適切な設定によるパフォーマンス最適化：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// layout.tsx
export const dynamic = 'force-dynamic'  // 動的レンダリング
export const revalidate = 3600  // 1時間ごとに再検証
export const fetchCache = 'force-cache'  // 強制的にキャッシュ
export const runtime = 'edge'  // エッジランタイムの使用

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          バンドルサイズの最適化
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                動的インポート
              </Typography>
              <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
                <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {`import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(
  () => import('../components/Heavy'),
  {
    loading: () => <p>読み込み中...</p>,
    ssr: false  // クライアントのみの場合
  }
)`}
                </Typography>
              </Paper>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                バンドル分析
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="@next/bundle-analyzer"
                    secondary="バンドルサイズの分析"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Tree Shaking"
                    secondary="未使用コードの削除"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="コード分割"
                    secondary="ルートベースの分割"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box component="section">
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          その他の最適化テクニック
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="フォントの最適化"
              secondary={
                <>
                  next/fontを使用した最適化：
                  <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                    <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                      {`import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})`}
                    </Typography>
                  </Paper>
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="スクリプトの最適化"
              secondary={
                <>
                  next/scriptを使用した読み込み制御：
                  <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                    <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                      {`import Script from 'next/script'

<Script
  src="https://example.com/script.js"
  strategy="lazyOnload"
/>`}
                    </Typography>
                  </Paper>
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="メタデータの最適化"
              secondary="SEOとパフォーマンスの両立"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Streaming SSR"
              secondary="段階的なページ読み込み"
            />
          </ListItem>
        </List>
      </Box>
    </Container>
  )
}
