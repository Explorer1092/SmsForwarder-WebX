import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
// 导入i18n配置
import './i18n/i18n';
// import './App.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
// 创建类似 Google 风格的主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#4285F4', // Google 蓝色
      light: '#5C9CFF',
      dark: '#3367D6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#DB4437', // Google 红色
      light: '#E25C4F',
      dark: '#C53929',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DB4437', // Google 红色
    },
    warning: {
      main: '#F4B400', // Google 黄色
    },
    info: {
      main: '#4285F4', // Google 蓝色
    },
    success: {
      main: '#0F9D58', // Google 绿色
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#202124',
      secondary: '#5F6368',
    },
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Arial", sans-serif',
    button: {
      textTransform: 'none', // Google 按钮通常不使用全大写
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // Google 设计中的圆角
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none', // Google 按钮通常没有阴影
          '&:hover': {
            boxShadow: '0px 1px 2px rgba(60, 64, 67, 0.3)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)', // 轻微阴影
        },
      },
    },
  },
});
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>,
);
