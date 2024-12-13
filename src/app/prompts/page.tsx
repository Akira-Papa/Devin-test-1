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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PromptForm>({
    resolver: zodResolver(promptSchema),
  });

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompts');
      if (response.ok) {
        const data = await response.json();
        setPrompts(data);
      } else if (response.status === 401) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('プロンプトの取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const onSubmit = async (data: PromptForm) => {
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        fetchPrompts();
      } else if (response.status === 401) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('プロンプトの追加に失敗しました:', error);
    }
  };

  const handleEdit = async (data: PromptForm) => {
    if (!editingPrompt) return;

    try {
      const response = await fetch(`/api/prompts/${editingPrompt._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setEditingPrompt(null);
        fetchPrompts();
      } else if (response.status === 401) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('プロンプトの更新に失敗しました:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPrompts();
      } else if (response.status === 401) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('プロンプトの削除に失敗しました:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: { xs: 8, sm: 9 }, py: 4 }}>
        <Typography variant="h2" component="h2" gutterBottom>
          プロンプト一覧
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="新規プロンプト"
              error={!!errors.content}
              helperText={errors.content?.message}
              {...register('content')}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
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
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(prompt._id)}
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
          onClose={() => setIsDialogOpen(false)}
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
              {...register('content')}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>キャンセル</Button>
            <Button onClick={handleSubmit(handleEdit)} color="primary">
              保存
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
