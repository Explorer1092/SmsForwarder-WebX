import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // 检测浏览器语言
    const detectBrowserLanguage = () => {
      const browserLang = navigator.language;
      // 如果是中文系统，使用中文
      if (browserLang.startsWith('zh')) {
        i18n.changeLanguage('zh');
      } else {
        i18n.changeLanguage('en');
      }
    };

    // 如果本地存储中没有语言设置，则根据浏览器语言自动设置
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (!savedLanguage) {
      detectBrowserLanguage();
    }
  }, [i18n]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    handleClose();
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage('zh')}>中文</MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
