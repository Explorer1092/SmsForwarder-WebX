"""
@Time: 2024/12/01 21:00
@Author: Amagi_Yukisaki
@File: app.py
"""

from pytimeparse.timeparse import timeparse
from jwt import DecodeError, ExpiredSignatureError
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os
import pytz

# 检查是否启用了简单模式（不使用Celery）
SIMPLE_MODE = os.environ.get("SIMPLE_MODE", "False") == "True"

# 如果不是简单模式，则导入Celery相关模块
if not SIMPLE_MODE:
    from flask_celery import celery_init_app

app = Flask(__name__)
api = Api()
db = SQLAlchemy()
jwt = JWTManager()
config = dict()
migrate = Migrate()
celery_app = None


def create_app():
    global app
    app = Flask("SmsForwarder-WebX")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DB_URI")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timeparse(
        os.environ.get("JWT_ACCESS_TOKEN_EXPIRES") or "3D")

    global config
    config["BACKEND_TOKEN"] = os.environ.get("BACKEND_TOKEN")
    config["ADMIN_USERNAME"] = os.environ.get("ADMIN_USERNAME")
    config["ADMIN_PASSWORD"] = os.environ.get("ADMIN_PASSWORD")
    config["TIMEZONE"] = pytz.timezone(os.environ.get("TIMEZONE"))
    config["SEND_API_SCHEME"] = os.environ.get("SEND_API_SCHEME")
    config["DEBUG"] = os.environ.get("DEBUG") == "True"

    global jwt
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
    jwt.init_app(app)

    global api
    api.init_app(app)
    jwt._set_error_handler_callbacks(api)

    @api.errorhandler(DecodeError)
    @app.errorhandler(DecodeError)
    @api.errorhandler(ExpiredSignatureError)
    @app.errorhandler(ExpiredSignatureError)
    def handle_decode_error(e):
        response = {
            "status": 401,
            "message": "Invalid token",
            "success": False}
        return response, 401
    from api.conversation_api import Conversation_API
    from api.conversation_list_api import Conversation_List_API
    from api.line_api import Line_API
    from api.message_api import Message_API
    from api.user_api import User_API
    from api.liveness_api import Liveness_API
    from api.error_handler import handle_decode_error

    global db
    db.init_app(app)
    with app.app_context():
        db.create_all()
    migrate = Migrate(app, db)

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

    return app, api
