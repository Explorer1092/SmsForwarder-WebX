"""
@Time: 2025/03/14
@File: api_blueprint.py
@Description: API蓝图
"""

from flask import Blueprint
from flask_restx import Api

# 创建API蓝图
api_bp = Blueprint('api', __name__, url_prefix='/api')

# 创建API实例
api = Api(api_bp,
          title='SmsForwarder-WebX API',
          version='1.0',
          description='SMS转发器Web版API',
          doc='/docs')

def init_api(jwt):
    """初始化API并注册所有资源"""
    # 导入 API 错误处理器
    from api.error_handler import handle_api_exception
    
    # 注意：我们不再在这里设置 JWT 错误处理回调
    # 因为我们现在使用 app.errorhandler 来处理 JWT 错误
    
    # 导入并注册API资源
    from api.conversation_api import Conversation_API
    from api.conversation_list_api import Conversation_List_API
    from api.line_api import Line_API
    from api.message_api import Message_API
    from api.user_api import User_API
    from api.liveness_api import Liveness_API
    from api.config_api import Config_Token_API
    
    return api
