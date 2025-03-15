"""
@Time: 2025/03/14
@File: __init__.py
@Description: 蓝图初始化模块
"""

from .frontend import frontend_bp
from .api_blueprint import api_bp, init_api

def register_blueprints(app, jwt=None):
    """
    注册所有蓝图到应用
    
    Args:
        app: Flask应用实例
        jwt: JWT管理器实例，用于API蓝图
    """
    app.logger.info('注册蓝图')
    
    # 注册前端路由蓝图
    app.register_blueprint(frontend_bp)
    app.logger.info('已注册前端路由蓝图')
    
    # 错误处理现在直接在 api/error_handler.py 中实现
    
    # 注册API蓝图
    app.register_blueprint(api_bp)
    if jwt:
        init_api(jwt)
    app.logger.info('已注册API蓝图')
