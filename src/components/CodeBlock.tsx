'use client'

import React from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'

interface CodeBlockProps {
  code: string
  language: string
  showLineNumbers?: boolean
}

export default function CodeBlock({
  code,
  language,
  showLineNumbers = true
}: CodeBlockProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        my: 2,
        '& pre': {
          margin: 0,
          padding: 2,
          overflow: 'auto',
          backgroundColor: (theme: Theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(0, 0, 0, 0.12)'
              : 'rgba(0, 0, 0, 0.04)',
        },
        '& code': {
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }
      }}
    >
      <Highlight
        theme={themes.github}
        code={code.trim()}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Box component="pre" style={style}>
            <Box component="code" className={className}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {showLineNumbers && (
                    <span style={{ marginRight: '1em', opacity: 0.3 }}>
                      {i + 1}
                    </span>
                  )}
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </Box>
          </Box>
        )}
      </Highlight>
    </Paper>
  )
}
