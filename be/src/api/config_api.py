"""
@Time: 2025/03/14
@File: config_api.py
@Description: 配置API
"""

from app import config
from flask_restx import Resource
from flask_jwt_extended import jwt_required
from blueprints.api_blueprint import api


@api.route('/v1/token')
class Config_Token_API(Resource):
    """配置Token API"""
    
    @jwt_required()
    def get(self):
        """获取Webhook Token
        
        Returns:
            dict: 包含token的字典
        """
        return {
            'token': config['BACKEND_TOKEN'],
            'status': 'success'
        }, 200
