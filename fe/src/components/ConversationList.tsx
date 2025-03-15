import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from "./react-infinite-scroll-component/index";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemButton,
  Toolbar,
  AppBar,
  CssBaseline,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import MessageIcon from '@mui/icons-material/Message';
import PhoneIcon from '@mui/icons-material/Phone';
import SettingsIcon from '@mui/icons-material/Settings';
import { fetchConversations } from '../services/api';
import { parseTime } from '../services/utils';
import { Conversation } from '../interfaces/Conversation';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const ConversationList: React.FC = () => {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [navi, setNavi] = useState(1);
  const [hasMoreConversations, setHasMoreConversations] = useState(true);
  const [start, setStart] = useState(0);
  const limit = 20;
  const navigate = useNavigate();

  const loadConversations = async (reset: boolean = false) => {
    if (start === 0 && !reset) return;
    try {
      const response = await fetchConversations(start, limit);
      if (response.conversations.length < limit) {
        setHasMoreConversations(false);
      }
      console.log(start, reset);
      if (reset) {
        setConversations(response.conversations);
        setStart(limit);
        return;
      }
      setConversations((prevConversations) => [...prevConversations, ...response.conversations]);
      setStart(start + limit);
    } catch (err) {
      setError(t('error.network'));
    }
  };

  useEffect(() => {
    setConversations([]);
    setHasMoreConversations(true);
    loadConversations(true);
  }, []);

  const handleConversationClick = (conversationId: number) => {
    navigate(`/conversation/${conversationId}`);
  };

  const handleNewConversation = () => {
    navigate('/conversation/new');
  };

  const handleRefresh = () => {
    setConversations([]);
    setHasMoreConversations(true);
    setStart(0);
    loadConversations(true);
  };

  const handleConfigClick = () => {
    navigate('/config');
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
            {t('conversation.title')}
          </Typography>
          <Box sx={{ marginLeft: 'auto', display: 'flex' }}>
            <LanguageSwitcher />
            <Tooltip title={t('common.refresh')}>
              <IconButton
                size="large"
                aria-label="refresh"
                color="inherit"
                onClick={handleRefresh}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('config.title')}>
              <IconButton
                size="large"
                aria-label="config"
                color="inherit"
                onClick={handleConfigClick}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              size="large"
              aria-label="new"
              color="inherit"
              onClick={handleNewConversation}
            >
              <AddIcon />
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
        <List sx={{
          pl: 0,
          pr: 0,
          pb: 7,
        }}
        >
          <InfiniteScroll
            dataLength={conversations.length}
            next={loadConversations}
            hasMore={hasMoreConversations}
            loader={<text>{t('common.loading')}</text>}
          >
            {conversations.map((conversation) => (
              <ListItem
                key={conversation.conversation_id}>
                <ListItemButton
                  onClick={() =>
                    handleConversationClick(conversation.conversation_id)
                  }>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography
                          variant="body1"
                          style={{
                            fontWeight: conversation.last_message_is_unread
                              ? 'bold'
                              : 'normal',
                          }}
                        >
                          {conversation.peer_number} via{' '}
                          {conversation.via_line_number}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{
                            fontWeight: conversation.last_message_is_unread
                              ? 'bold'
                              : 'normal',
                          }}
                        >
                          {parseTime(conversation.last_message_time)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <span
                        style={{
                          fontWeight: conversation.last_message_is_unread
                            ? 'bold'
                            : 'normal',
                        }}
                      >
                        {conversation.last_message_content}
                      </span>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </InfiniteScroll>
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
            if (newValue === 0) {
              navigate('/line');
            }
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

export default ConversationList;
