import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ConversationList from './components/ConversationList';
import MessageList from './components/MessageList';
import NewConversation from './components/NewConversation';
import LineList from './components/LineList';
import './styles/App.css';
import LineComponent from './components/Line';
import LanguageSwitcher from './components/LanguageSwitcher';
import Config from './components/Config';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConversationList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/line" element={<LineList />} />
        <Route path="/line/:lineId" element={<LineComponent />} />
        <Route path="/conversation/new" element={<NewConversation />} />
        <Route path="/conversation/:conversationId" element={<MessageList />} />
        <Route path="/config" element={<Config />} />
      </Routes>
    </Router>
  );
};

export default App;
