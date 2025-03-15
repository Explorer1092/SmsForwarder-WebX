"""
@Time: 2024/12/01 21:00
@Author: Amagi_Yukisaki
@File: app.py
"""

from pytimeparse.timeparse import timeparse
from jwt import DecodeError, ExpiredSignatureError
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api
from flask_jwt_extended import JWTManager
import os
import pytz
import json
import secrets
import string
import logging

# 导入蓝图注册函数
from blueprints import register_blueprints

# 检查是否启用了简单模式（不使用Celery）
SIMPLE_MODE = os.environ.get("SIMPLE_MODE", "False") == "True"

# 如果不是简单模式，则导入Celery相关模块
if not SIMPLE_MODE:
    from flask_celery import celery_init_app

app = Flask(__name__)
db = SQLAlchemy()
jwt = JWTManager()
config = dict()
celery_app = None


def generate_secure_token(length=32):
    """生成安全的随机令牌"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def load_or_create_config():
    """加载或创建配置文件"""
    config_path = "/app/data/config.json"
    config_data = {}
    
    # 检查配置文件是否存在
    if os.path.exists(config_path):
        try:
            with open(config_path, 'r') as f:
                config_data = json.load(f)
            print("配置文件已加载")
        except Exception as e:
            print(f"加载配置文件出错: {e}")
            # 如果加载失败，创建新的配置
            config_data = {}
    
    # 检查必要的配置项是否存在，不存在则创建
    is_new_config = False
    if "BACKEND_TOKEN" not in config_data:
        config_data["BACKEND_TOKEN"] = os.environ.get("BACKEND_TOKEN") or generate_secure_token()
        is_new_config = True
    
    if "ADMIN_PASSWORD" not in config_data:
        config_data["ADMIN_PASSWORD"] = os.environ.get("ADMIN_PASSWORD") or "admin"
        is_new_config = True
    
    if "SECRET_KEY" not in config_data:
        config_data["SECRET_KEY"] = os.environ.get("SECRET_KEY") or generate_secure_token()
        is_new_config = True
    
    # 如果是新配置或有更新，保存到文件
    if is_new_config:
        try:
            # 确保目录存在
            os.makedirs(os.path.dirname(config_path), exist_ok=True)
            with open(config_path, 'w') as f:
                json.dump(config_data, f, indent=2)
            print("新配置已保存")
        except Exception as e:
            print(f"保存配置文件出错: {e}")
    
    return config_data

def create_app():
    global app
    app = Flask("SmsForwarder-WebX", static_folder="/app/static", static_url_path="")
    
    # 设置日志级别
    app.logger.setLevel(logging.DEBUG)
    app.logger.info('Flask应用初始化')
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DB_URI")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timeparse(
        os.environ.get("JWT_ACCESS_TOKEN_EXPIRES") or "3D")
    
    # 加载或创建配置
    config_data = load_or_create_config()
    
    global config
    config["BACKEND_TOKEN"] = config_data.get("BACKEND_TOKEN")
    config["ADMIN_USERNAME"] = os.environ.get("ADMIN_USERNAME") or "admin"
    config["ADMIN_PASSWORD"] = config_data.get("ADMIN_PASSWORD")
    config["TIMEZONE"] = pytz.timezone(os.environ.get("TIMEZONE") or "Asia/Shanghai")
    config["SEND_API_SCHEME"] = os.environ.get("SEND_API_SCHEME")
    config["DEBUG"] = os.environ.get("DEBUG") == "True"

    global jwt
    app.config["SECRET_KEY"] = config_data.get("SECRET_KEY")
    app.config["JWT_ERROR_MESSAGE_KEY"] = "message"
    app.config["PROPAGATE_EXCEPTIONS"] = False  # 不传播异常，由错误处理器处理
    jwt.init_app(app)
    
    # 导入错误处理器 - 必须在 jwt.init_app 之后导入
    from api.error_handler import handle_decode_error, handle_expired_error, handle_jwt_extended_error, handle_no_auth_error, handle_general_exception

    # 注册所有蓝图，并传递 JWT 管理器
    register_blueprints(app, jwt)
    from api.conversation_api import Conversation_API
    from api.conversation_list_api import Conversation_List_API
    from api.line_api import Line_API
    from api.message_api import Message_API
    from api.user_api import User_API
    from api.liveness_api import Liveness_API

    global db
    db.init_app(app)
    with app.app_context():
        db.create_all()

    # 只有在非简单模式下才配置Celery
    if not SIMPLE_MODE:
        app.config.from_mapping(
            CELERY=dict(
                broker_url=os.environ.get("CELERY_BROKER_URI"),
                result_backend=os.environ.get("CELERY_RESULT_BACKEND"),
                task_ignore_result=True,
            ),
        )
        celery_app = celery_init_app(app)

    return app
