"""
@Time: 2025/03/14
@File: frontend.py
@Description: 前端路由蓝图
"""

from flask import Blueprint, current_app, request, send_from_directory
import logging

# 创建前端蓝图
frontend_bp = Blueprint('frontend', __name__)

@frontend_bp.route('/')
def index():
    """根路径，返回前端首页"""
    current_app.logger.info('访问根路径 /')
    try:
        return current_app.send_static_file('index.html')
    except Exception as e:
        current_app.logger.error(f'返回index.html时出错: {str(e)}')
        return {'error': f'无法加载前端页面: {str(e)}'}, 500

@frontend_bp.route('/login')
def login():
    """登录路径，返回前端首页由前端路由处理"""
    current_app.logger.info(f'访问登录路径 /login, 参数: {request.args}')
    try:
        return current_app.send_static_file('index.html')
    except Exception as e:
        current_app.logger.error(f'返回index.html时出错: {str(e)}')
        return {'error': f'无法加载前端页面: {str(e)}'}, 500

@frontend_bp.route('/<path:path>')
def catch_all(path):
    """通配符路由，处理所有其他前端路由"""
    current_app.logger.info(f'捕获到路径请求: {path}, 请求方法: {request.method}, 参数: {request.args}')
    
    # 如果路径以 api 开头，返回 404，因为这应该由 API 路由处理
    if path.startswith('api/'):
        current_app.logger.warning(f'API路径未找到: {path}')
        return {'error': 'API not found'}, 404
    
    # 否则返回 index.html，由前端路由处理
    current_app.logger.info(f'返回index.html用于前端路由: {path}')
    try:
        return current_app.send_static_file('index.html')
    except Exception as e:
        current_app.logger.error(f'返回index.html时出错: {str(e)}')
        return {'error': f'无法加载前端页面: {str(e)}'}, 500
