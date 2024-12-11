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
  title: 'APIルート | Next.js ドキュメント',
  description: 'Next.jsのAPIルートの作成方法、ハンドラーの実装、ミドルウェアの使用について解説します。',
}

export default function ApiRoutesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        APIルートの作成
      </Typography>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          Route Handlers
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          App RouterでのAPIルートは、Route Handlersを使用して作成します：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// app/api/users/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const users = [
    { id: 1, name: '山田太郎' },
    { id: 2, name: '鈴木花子' }
  ]
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const data = await request.json()
  // データベースに保存する処理
  return NextResponse.json({ message: 'ユーザーを作成しました' })
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          動的ルート
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          動的なパラメータを使用したAPIルートの作成方法：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  // IDに基づいてユーザーを取得
  return NextResponse.json({ id, name: '山田太郎' })
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          ミドルウェア
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          リクエストの処理前に実行される処理を定義できます：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 認証トークンの確認
  const token = request.headers.get('authorization')

  if (!token) {
    return NextResponse.json(
      { error: '認証が必要です' },
      { status: 401 }
    )
  }

  return NextResponse.next()
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section">
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          APIルートのベストプラクティス
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                セキュリティ
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="入力のバリデーション"
                    secondary="リクエストデータの検証を必ず行う"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="CORS設定"
                    secondary="適切なオリジンの設定"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="レート制限"
                    secondary="過剰なリクエストの制限"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                パフォーマンス
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="キャッシュの活用"
                    secondary="適切なキャッシュヘッダーの設定"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="エラーハンドリング"
                    secondary="適切なステータスコードの返却"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="応答時間の最適化"
                    secondary="非同期処理の効率的な使用"
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
