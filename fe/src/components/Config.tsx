import React, { useEffect, useState } from 'react';
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
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { fetchConfigToken } from '../services/api';

const Config: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [backendToken, setBackendToken] = useState<string>('');

  // 获取当前主机名，用于构建 Webhook URL
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  const webhookUrl = `${protocol}//${hostname}${port}/api/v1/message`;

  // Webhook 模板
  const webhookTemplate = `{
  "from": "[from]",
  "content": "[org_content]",
  "timestamp": "[timestamp]",
  "device_mark": "[device_mark]",
  "app_version": "[app_version]",
  "card_slot": "[card_slot]",
  "receive_time": "[receive_time]",
  "token": "${backendToken}"
}`;

  // 复制文本到剪贴板
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.error('复制失败:', err);
        setError(t('error.copy'));
      });
  };

  // 获取后端 token
  const loadBackendToken = async () => {
    try {
      const response = await fetchConfigToken();
      if (response && response.token) {
        setBackendToken(response.token);
      } else {
        setError(t('error.token'));
      }
    } catch (err) {
      console.error('获取 token 失败:', err);
      setError(t('error.token'));
    }
  };

  // 页面加载时获取 token
  useEffect(() => {
    loadBackendToken();
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="back"
            edge="start"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div"
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
            }}>
            {t('config.title')}
          </Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            <LanguageSwitcher />
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3, width: '100%' }} className="box-main">
        <Toolbar />
        {error && (
          <Typography color="error" variant="body2" align="center">
            {error}
          </Typography>
        )}
        
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardHeader title={t('config.server')} />
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              {t('config.webhook_url')}
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                {webhookUrl}
              </Typography>
              <Tooltip title={t('common.copy')}>
                <IconButton 
                  onClick={() => copyToClipboard(webhookUrl, t('config.url_copied'))}
                  size="small"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Paper>

            <Typography variant="subtitle1" gutterBottom>
              {t('config.webhook_template')}
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                position: 'relative',
                mb: 2
              }}
            >
              <pre style={{ 
                margin: 0, 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {webhookTemplate}
              </pre>
              <Tooltip title={t('common.copy')} sx={{ position: 'absolute', top: 8, right: 8 }}>
                <IconButton 
                  onClick={() => copyToClipboard(webhookTemplate, t('config.template_copied'))}
                  size="small"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Paper>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardHeader title={t('config.client_setup')} />
          <CardContent>
            <Typography variant="body1" paragraph>
              {t('config.client_instruction')}
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary={t('config.step1')} 
                  secondary={t('config.step1_desc')}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText 
                  primary={t('config.step2')} 
                  secondary={t('config.step2_desc')}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText 
                  primary={t('config.step3')} 
                  secondary={t('config.step3_desc', { webhookUrl })}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText 
                  primary={t('config.step4')} 
                  secondary={t('config.step4_desc')}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Config;
