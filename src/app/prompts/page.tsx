'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const promptSchema = z.object({
  content: z.string().min(1, 'プロンプトは必須です'),
});

type PromptForm = z.infer<typeof promptSchema>;

interface Prompt {
  _id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function PromptsPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PromptForm>({
    resolver: zodResolver(promptSchema),
  });

  useEffect(() => {
    const eventSource = new EventSource('/api/prompts/sse');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'create') {
        setPrompts(prev => [data.prompt, ...prev]);
      } else if (data.type === 'update') {
        setPrompts(prev => prev.map(p =>
          p._id === data.prompt._id ? data.prompt : p
        ));
      } else if (data.type === 'delete') {
        setPrompts(prev => prev.filter(p => p._id !== data.promptId));
      }
    };

    eventSource.onerror = () => {
      setError('リアルタイム更新の接続に失敗しました');
    };

    const fetchInitialPrompts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/prompts');
        if (response.ok) {
          const data = await response.json();
          setPrompts(data);
        } else if (response.status === 401) {
          router.push('/auth/login');
        }
      } catch (error) {
        setError('プロンプトの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPrompts();
    return () => eventSource.close();
  }, [router]);

  const onSubmit = async (data: PromptForm) => {
    setLoading(true);
    setError(null);

    const optimisticPrompt: Prompt = {
      _id: Date.now().toString(),
      content: data.content,
      userId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPrompts(prev => [optimisticPrompt, ...prev]);

    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      reset();
    } catch (error) {
      setError('プロンプトの追加に失敗しました');
      setPrompts(prev => prev.filter(p => p._id !== optimisticPrompt._id));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data: PromptForm) => {
    if (!editingPrompt) return;
    setLoading(true);
    setError(null);

    const originalPrompt = editingPrompt;
    const updatedPrompt = { ...originalPrompt, content: data.content };

    setPrompts(prev => prev.map(p =>
      p._id === originalPrompt._id ? updatedPrompt : p
    ));

    try {
      const response = await fetch(`/api/prompts/${originalPrompt._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      setIsDialogOpen(false);
      setEditingPrompt(null);
    } catch (error) {
      setError('プロンプトの更新に失敗しました');
      setPrompts(prev => prev.map(p =>
        p._id === originalPrompt._id ? originalPrompt : p
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);

    const deletedPrompt = prompts.find(p => p._id === id);
    if (!deletedPrompt) return;

    setPrompts(prev => prev.filter(p => p._id !== id));

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      setError('プロンプトの削除に失敗しました');
      setPrompts(prev => [...prev, deletedPrompt]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: { xs: 8, sm: 9 }, py: 4 }}>
        <Typography variant="h2" component="h2" gutterBottom>
          プロンプト一覧
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="新規プロンプト"
              error={!!errors.content}
              helperText={errors.content?.message}
              disabled={loading}
              {...register('content')}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              追加
            </Button>
          </Box>
        </Paper>

        <List>
          {prompts.map((prompt) => (
            <ListItem
              key={prompt._id}
              sx={{
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
              }}
            >
              <Paper elevation={2} sx={{ p: 2, width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography sx={{ flex: 1, mr: 2 }}>{prompt.content}</Typography>
                  <Box>
                    <IconButton
                      onClick={() => {
                        setEditingPrompt(prompt);
                        setIsDialogOpen(true);
                      }}
                      disabled={loading}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(prompt._id)}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </ListItem>
          ))}
        </List>

        <Dialog
          open={isDialogOpen}
          onClose={() => !loading && setIsDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>プロンプトを編集</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              defaultValue={editingPrompt?.content}
              disabled={loading}
              {...register('content')}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)} disabled={loading}>
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit(handleEdit)}
              color="primary"
              disabled={loading}
            >
              保存
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
