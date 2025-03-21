import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
  IconButton,
  CssBaseline,
  AppBar,
  Toolbar,
  Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import { fetchLines, createConversation, handleLogout } from '../services/api';
import { Line } from '../interfaces/Line';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const NewConversation: React.FC = () => {
  const { t } = useTranslation();
  const [lines, setLines] = useState<Line[]>([]); // To store available lines
  const [selectedLine, setSelectedLine] = useState<string>(''); // To store the selected line
  const [number, setNumber] = useState<number | string>(''); // To store the number input
  const [content, setContent] = useState<string>(''); // To store the content input
  const [error, setError] = useState<string | null>(null); // To store any error messages
  const [loading, setLoading] = useState<boolean>(false); // To indicate loading state

  useEffect(() => {
    const loadLines = async () => {
      try {
        const response = await fetchLines();
        setLines(response);
      } catch (err) {
        setError(t('error.network'));
      }
    };

    loadLines();
  }, []);

  const handleSubmit = async () => {
    if (!selectedLine || !number || !content) {
      setError(t('error.unknown'));
      return;
    }

    setLoading(true);
    try {
      const response = await createConversation(selectedLine, number, content);
      if (response.conversation_id) {
        window.location.href = `/conversation/${response.conversation_id}`;
      }
    } catch (err) {
      setError(t('error.network'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('conversation.new')}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <LanguageSwitcher />
            <IconButton
              size="large"
              aria-label="logout"
              color="inherit"
              onClick={handleLogout}
            >
              <LogoutIcon />
            </IconButton>
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
        <Box className='input-group-padding'>
          <TextField
            label={t('line.number')}
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            sx={{ marginRight: '10px' }}
            fullWidth
          />
          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel id="line-label">{t('line.title')}</InputLabel>
            <Select
              labelId="line-label"
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              label={t('line.title')}
            >
              {lines.map((line, index) => (
                <MenuItem key={index} value={line.id}>
                  {line.number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Paper
        component="form"
        className='paper-bottom-input'
      >
        <TextField
          sx={{ ml: 1, flex: 1 }}
          label={t('message.content')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          maxRows={4}
        />
        <IconButton type="button" sx={{ p: '10px' }} onClick={handleSubmit}>
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default NewConversation;
