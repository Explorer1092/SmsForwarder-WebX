import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  ListItemButton,
  Fab,
  Toolbar,
  AppBar,
  CssBaseline,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import PhoneIcon from '@mui/icons-material/Phone';
import { fetchLines } from '../services/api';
import { Line } from '../interfaces/Line';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const LineList: React.FC = () => {
  const { t } = useTranslation();
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [navi, setNavi] = useState(0);
  const navigate = useNavigate();

  const loadLines = async (reset: boolean = false) => {
    try {
      const response = await fetchLines();
      setLines(response);
    } catch (err) {
      setError(t('error.network'));
    }
  };

  useEffect(() => {
    loadLines(true);
  }, []);

  const handleLineClick = (lineId: number) => {
    navigate(`/line/${lineId}`);
  };

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
            {t('line.title')}
          </Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            <LanguageSwitcher />
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" className="box-main">
        <Toolbar />
        {error && (
          <Typography color="error" variant="body2" align="center">
            {error}
          </Typography>
        )}
        <List sx={{
          pl: 0,
          pr: 0,
          pb: 7,
        }}>
          {lines.map((line) => (
            <ListItem key={line.id}>
              <ListItemButton
                onClick={() => handleLineClick(line.id)}
              >
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body1">{line.number}</Typography>
                    </Box>
                  }
                  secondary={
                    <Typography>
                      sim{line.sim_slot} on {line.device_mark} @ {line.addr}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Paper
        className='paper-bottom-nav'
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={navi}
          onChange={(event, newValue) => {
            setNavi(newValue);
            if (newValue === 1) {
              navigate('/');
            }
          }}
        >
          <BottomNavigationAction label={t('line.title')} icon={<PhoneIcon />} />
          <BottomNavigationAction
            label={t('conversation.title')}
            icon={<MessageIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default LineList;
