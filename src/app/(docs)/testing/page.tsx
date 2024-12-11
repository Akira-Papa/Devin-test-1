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
  title: 'テスト | Next.js ドキュメント',
  description: 'Next.jsアプリケーションのテスト方法、Jest、React Testing Library、Cypressの使用方法について解説します。',
}

export default function TestingPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        テストの書き方
      </Typography>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          単体テスト（Jest + React Testing Library）
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          コンポーネントの単体テストの書き方：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Buttonコンポーネント', () => {
  it('クリックイベントが発火する', async () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>クリック</Button>)

    await userEvent.click(
      screen.getByRole('button', { name: 'クリック' })
    )

    expect(onClick).toHaveBeenCalled()
  })
})`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          APIルートのテスト
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          APIルートのテスト方法：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// __tests__/api/users.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/users/route'

describe('ユーザーAPI', () => {
  it('ユーザー一覧を取得できる', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(Array.isArray(data)).toBe(true)
  })
})`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          E2Eテスト（Cypress）
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Cypressを使用したE2Eテストの例：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// cypress/e2e/login.cy.ts
describe('ログインフロー', () => {
  it('正常にログインできる', () => {
    cy.visit('/login')

    cy.get('[data-testid="email"]')
      .type('test@example.com')

    cy.get('[data-testid="password"]')
      .type('password123')

    cy.get('button[type="submit"]')
      .click()

    cy.url().should('include', '/dashboard')
  })
})`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section">
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          テストの種類と使い分け
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                単体テスト
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="コンポーネントのテスト"
                    secondary="個別の機能確認"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="ユーティリティ関数"
                    secondary="ロジックの検証"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="高速な実行"
                    secondary="開発中の即時フィードバック"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                統合テスト
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="複数機能の連携"
                    secondary="コンポーネント間の相互作用"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="APIとの結合"
                    secondary="データフローの検証"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="ミドルウェア"
                    secondary="認証・認可の確認"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                E2Eテスト
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="ユーザーフロー"
                    secondary="実際の操作シナリオ"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="ブラウザ動作"
                    secondary="実環境に近い検証"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="回帰テスト"
                    secondary="重要機能の継続的確認"
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
