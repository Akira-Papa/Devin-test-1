'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSettingsSchema, UserSettings } from '@/types/user-settings';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState } from 'react';

export default function SettingsPage() {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserSettings>({
    resolver: zodResolver(userSettingsSchema),
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data: UserSettings) => {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();

      setSnackbar({
        open: true,
        message: '設定を更新しました',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: '設定の更新に失敗しました',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 8, sm: 9 }, py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 6 },
          borderRadius: 2,
          backgroundColor: 'background.paper',
          boxShadow: (theme) => theme.shadows[3],
        }}
      >
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          align="center"
          sx={{
            mb: 4,
            fontWeight: 700,
            color: 'primary.main',
          }}
        >
          ユーザー設定
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
          <TextField
            label="名前"
            required
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
            sx={{ mb: 3 }}
          />
          <TextField
            label="メールアドレス"
            required
            fullWidth
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
            sx={{ mb: 3 }}
          />
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="language-label">言語</InputLabel>
            <Select
              labelId="language-label"
              label="言語"
              defaultValue="ja"
              {...register('language')}
            >
              <MenuItem value="ja">日本語</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                {...register('emailNotifications')}
                defaultChecked
              />
            }
            label="メール通知を受け取る"
            sx={{ mb: 3 }}
          />
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id="theme-label">テーマ</InputLabel>
            <Select
              labelId="theme-label"
              label="テーマ"
              defaultValue="system"
              {...register('theme')}
            >
              <MenuItem value="light">ライト</MenuItem>
              <MenuItem value="dark">ダーク</MenuItem>
              <MenuItem value="system">システム設定に従う</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            設定を保存
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
};
