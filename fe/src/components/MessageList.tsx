import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from "./react-infinite-scroll-component/index";
import {
  Box,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  CssBaseline,
  AppBar,
  Toolbar,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  handleLogout,
  fetchMessages,
  sendMessage,
  deleteConversation,
} from '../services/api';
import { parseTime } from '../services/utils';
import { pink, grey } from '@mui/material/colors';
import { Message } from '../interfaces/Message';

const MessageList: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [lineNumber, setLineNumber] = useState<string | null>(null);
  const [peerNumber, setPeerNumber] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [start, setStart] = useState(0);
  const [open, setOpen] = useState(false);
  const limit = 20;

  const loadMessages = async (reset: boolean = false) => {
    if (!conversationId) return;
    if (start === 0 && !reset) return;
    try {
      const response = await fetchMessages(conversationId, start, limit);
      setHasMoreMessages(response.has_next);
      if (reset) {
        setMessages(response.messages);
        setStart(limit);
        setLineNumber(response.via_line_number);
        setPeerNumber(response.peer_number);
        window.scrollTo(0, document.body.scrollHeight / 2);
        return;
      } else {
        setMessages((prevMessages) => [...prevMessages, ...response.messages]);
        setStart(start + limit);
      }
    } catch (err) {
      setError('Failed to load messages.');
    }
  };

  useEffect(() => {
    setMessages([]);
    setHasMoreMessages(true);
    setLineNumber(null);
    setPeerNumber(null);
    setOpen(false);
    loadMessages(true);
  }, [conversationId]);


  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    // Add logic for sending message here (API call)
    sendMessage(conversationId as string, newMessage)
      .then((response) => {
        // read from response and update messages
        setMessages((prevMessages) => [
          {
            display_time: response.display_time,
            content: newMessage,
            type: 'OUT',
            status: 'SENT',
          },
          ...prevMessages,
        ]);
      })
      .catch(() => {
        setError('Failed to send message.');
      });
    setNewMessage('');
  };

  return (
    <Box>
      < CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {peerNumber}{' '}
            <Typography variant="caption" display="inline">
              via {lineNumber}
            </Typography>
          </Typography>
          <IconButton
            size="large"
            aria-label="logout"
            color="inherit"
            onClick={handleLogout}
          >
            <LogoutIcon />
          </IconButton>
          <IconButton
            size="large"
            aria-label="logout"
            color="inherit"
            onClick={() => {
              setOpen(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }} className="box-main">
        <Toolbar />
        {error && (
          <Typography color="error" variant="body2" align="center">
            {error}
          </Typography>
        )}
        <List
          className="messages-list"
        // style={{ display: "flex", flexDirection: "column-reverse", overflow: "auto" }}
        >
          <InfiniteScroll
            dataLength={messages.length}
            next={loadMessages}
            hasMore={hasMoreMessages}
            inverse={true}
            loader={<React.Fragment>Loading...</React.Fragment>}
            style={{ display: "flex", flexDirection: "column-reverse" }}
            scrollThreshold={'80%'}
          >
            {messages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent:
                    message.type === 'IN' ? 'flex-start' : 'flex-end',
                  display: 'flex',
                  marginBottom: '10px',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor:
                      message.type === 'OUT' ? pink[50] : grey[300],
                    color: message.type === 'OUT' ? pink[800] : grey[900],
                  }}
                >
                  <Typography variant="body2" style={{ wordBreak: 'break-word' }}>
                    {message.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    mt={1}
                    align={message.type === 'IN' ? 'left' : 'right'}
                  >
                    {parseTime(message.display_time)}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </InfiniteScroll>
        </List>
        <Paper
          component="form"
          className="paper-bottom-input input-group-padding"
        >
          <TextField
            sx={{ ml: 1, flex: 1 }}
            label="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            multiline
            maxRows={4}
          />
          <IconButton
            type="button"
            sx={{ p: '10px' }}
            onClick={handleSendMessage}
          >
            <SendIcon />
          </IconButton>
        </Paper>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete {peerNumber} via {lineNumber}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure to delete this conversation?
              <Typography color="error">THIS CANNOT BE UNDONE</Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => setOpen(false)}>
              NO
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                deleteConversation(conversationId as string)
                  .then(() => {
                    window.location.href = '/';
                  })
                  .catch(() => {
                    setOpen(false);
                    setError('Failed to delete conversation.');
                  });
              }}
              autoFocus
            >
              YES
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box >
  );
};

export default MessageList;
