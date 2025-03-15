#!/bin/sh

# 确保数据目录存在
mkdir -p /app/data

# 设置环境变量以启用调试模式
export FLASK_ENV=development
export FLASK_DEBUG=1

# 启动 Gunicorn 服务器并启用调试日志
gunicorn -w 4 -b 0.0.0.0:8000 --log-level debug --access-logfile - --error-logfile - wsgi:app