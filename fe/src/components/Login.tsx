import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CssBaseline,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { handleLogin } from '../services/api';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div"
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
            }}>
            SMS Forwarder WebX
          </Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            <LanguageSwitcher />
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }} className="box-main">
        <Toolbar />
        {error && (
          <Typography color="error" variant="body2" align="center">
            {error}
          </Typography>
        )}
        <Card
          variant="outlined"
          sx={{ minWidth: 275, maxWidth: '80%', margin: 'auto', mt: 6 }}
        >
          <CardHeader title={t('common.login')} sx={{ margin: 'auto' }}></CardHeader>
          <CardContent>
            <TextField
              label={t('common.username')}
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              fullWidth
            />
            <TextField
              label={t('common.password')}
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                try {
                  await handleLogin(username, password);
                } catch (err) {
                  setError(t('error.login'));
                }
              }}
              fullWidth
            >
              {t('common.login')}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;
