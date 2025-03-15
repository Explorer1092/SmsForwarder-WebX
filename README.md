# SmsForwarder-WebX

## Docker 部署

### 使用预构建镜像

```bash
# 拉取最新镜像
docker pull donjohnson630/smsforwarder-webx:latest

# 运行容器
docker run -d \
  -p 8000:8000 \
  -v ./data:/app/data \
  --name smsforwarder \
  donjohnson630/smsforwarder-webx:latest
```

### 使用 Docker Compose

```bash
# 克隆仓库
git clone https://github.com/Explorer1092/SmsForwarder-WebX.git
cd SmsForwarder-WebX

# 启动服务
docker-compose up -d
```

### 版本标签

- `donjohnson630/smsforwarder-webx:latest` - 最新版本
- `donjohnson630/smsforwarder-webx:vX.Y.Z` - 特定版本
- `donjohnson630/smsforwarder-webx:backend-latest` - 仅后端服务
- `donjohnson630/smsforwarder-webx:frontend-latest` - 仅前端服务

### 配置说明

首次启动时，系统会自动在 `./data/config.json` 中生成以下配置：

```json
{
  "BACKEND_TOKEN": "自动生成的令牌",
  "ADMIN_PASSWORD": "admin",
  "SECRET_KEY": "自动生成的密钥"
}
```

您可以根据需要修改这些配置。

## backend config

```sh
export SEND_API_SCHEME="http://{}:5000/sms/send"
export DB_URI="sqlite:///./database.db"
export CELERY_BROKER_URI="amqp://smsforwarder:smsforwarder@localhost:5672/smsforwarder"
export CELERY_RESULT_BACKEND="rpc://"
export BACKEND_TOKEN="BACKEND_TOKEN"
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="admin"
export SECRET_KEY="JWT_SECRET_KEY"
export TIMEZONE="Asia/Shanghai"
export DEBUG="True" # for debug, which will block sending real SMS
cd be/src
python3 debug_entry.py
```

## SMS forwarder config

### Webhook post template

```json
{
  "from": "[from]",
  "content": "[org_content]",
  "timestamp": "[timestamp]",
  "device_mark": "[device_mark]",
  "app_version": "[app_version]",
  "card_slot": "[card_slot]",
  "receive_time": "[receive_time]",
  "token": "BACKEND_TOKEN"
}
```

## Frontend config

```sh
export REACT_APP_BACKEND_URL="http://localhost:8000"
cd fe
yarn install
yarn start
```

## 开发者信息

### 构建并推送 Docker 镜像

本项目使用 GitHub Actions 自动构建和推送 Docker 镜像。当您创建一个新的 Git 标签（以 `v` 开头）时，将自动触发构建流程。

```bash
# 创建新标签
git tag v1.0.0

# 推送标签到 GitHub
git push origin v1.0.0
```

### GitHub Actions 配置

在使用 GitHub Actions 自动构建之前，您需要确保 GitHub 仓库已启用 GitHub Actions 功能。系统会使用 GitHub 提供的 `GITHUB_TOKEN` 进行身份验证，无需额外配置。

## Restful API

**POST /api/v1/login**

```json
{
  "username": "admin",
  "password": "admin"
}
```

```json
{
  "access_token": "JWT_HERE"
}
```

**GET /api/v1/line?id=x**

Get line info with id=x

```json
{
  "id": 1,
  "number": "18888888888",
  "sim_slot": "1",
  "device_mark": "samsung",
  "addr": "192.168.1.1"
}
```

**GET /api/v1/conversation/list?start=x&limit=y**

Get conversation list, jump first x records, return y records

```json
{
  "conversations": [
    {
      "conversation_id": 1,
      "last_message_time": "2024-12-01 21:35:28",
      "last_message_content": "【Web】恭喜您，该发送通道测试成功，请继续添加转发规则！"
      "last_message_is_unread": false,
      "peer_number": "19999999999",
      "via_line_number": "18888888888"
    }
  ],
  "has_next": false
}
```

**GET /api/v1/conversation?id=x?start=y&limit=z**

Return info about conversation with id=x, jump first y records, return z records,

```json
{
  "peer_number": "19999999999",
  "via_line_number": "18888888888",
  "has_next": true,
  "line_id": 1,
  "messages": [
    {
      "display_time": "2024-12-01 22:04:21",
      "content": "xxxxxxx",
      "type": "OUT",
      "status": "SENT"
    },
    {
      "display_time": "2024-12-01 21:35:28",
      "content": "\u3010Web\u3011\u606d\u559c\u60a8\uff0c\u8be5\u53d1\u9001\u901a\u9053\u6d4b\u8bd5\u6210\u529f\uff0c\u8bf7\u7ee7\u7eed\u6dfb\u52a0\u8f6c\u53d1\u89c4\u5219\uff01",
      "type": "IN",
      "status": "READ"
    }
  ]
}
```

**POST /api/v1/conversation**

Send new message

```json
{
  "content": "xxxxxx",
  "peer_number": "19999999999",
  "line_id": 1
}
```

OR

```json
{
  "content": "xxxxxx",
  "conversation_id": 1
}
```

```json
{
  "message": "success"
}
```
