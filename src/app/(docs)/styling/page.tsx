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
  title: 'スタイリング | Next.js ドキュメント',
  description: 'Next.jsでのCSS Modules、Tailwind CSS、その他のスタイリング手法について解説します。',
}

export default function StylingPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        スタイリング手法
      </Typography>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          CSS Modules
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          CSS Modulesは、スコープ付きのCSSを提供し、クラス名の衝突を防ぎます：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// styles/Button.module.css
.button {
  padding: 1rem 2rem;
  background: #0070f3;
  color: white;
  border-radius: 4px;
}

// components/Button.tsx
import styles from './Button.module.css'

export default function Button() {
  return (
    <button className={styles.button}>
      クリック
    </button>
  )
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          Tailwind CSS
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Tailwind CSSは、ユーティリティファーストのCSSフレームワークです：
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, my: 3, bgcolor: 'grey.50' }}>
          <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0070f3',
      },
    },
  },
  plugins: [],
}

// components/Card.tsx
export default function Card() {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl
                    shadow-md flex items-center space-x-4">
      <div className="flex-shrink-0">
        <img className="h-12 w-12" src="/icon.svg" alt="アイコン" />
      </div>
      <div>
        <div className="text-xl font-medium text-black">
          カードタイトル
        </div>
        <p className="text-gray-500">
          カードの説明文
        </p>
      </div>
    </div>
  )
}`}
          </Typography>
        </Paper>
      </Box>

      <Box component="section">
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
          スタイリング手法の比較
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                CSS Modules
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="スコープ付きCSS"
                    secondary="クラス名の衝突を防止"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="TypeScript対応"
                    secondary="型安全なスタイリング"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="コンポーネント単位"
                    secondary="モジュール化されたスタイル"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                Tailwind CSS
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="ユーティリティファースト"
                    secondary="事前定義されたクラス"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="高い生産性"
                    secondary="素早いスタイリング"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="カスタマイズ可能"
                    secondary="テーマの拡張が容易"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            その他のスタイリング手法
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Styled Components"
                secondary="CSS-in-JSライブラリ"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Emotion"
                secondary="柔軟なCSS-in-JSソリューション"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Sass/SCSS"
                secondary="拡張されたCSS言語"
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Container>
  )
}
