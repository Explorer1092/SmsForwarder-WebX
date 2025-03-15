from jwt import DecodeError, ExpiredSignatureError
from flask_jwt_extended.exceptions import JWTExtendedException, NoAuthorizationError
from flask import jsonify
from app import app
from blueprints.api_blueprint import api
import traceback

def create_error_response(status_code, message):
    """创建标准错误响应"""
    response = jsonify({
        "status": status_code,
        "message": message,
        "success": False
    })
    response.status_code = status_code
    return response


# 注册全局异常处理器
@app.errorhandler(DecodeError)
def handle_decode_error(e):
    """处理 JWT 解码错误"""
    return create_error_response(401, "无效的令牌")


@app.errorhandler(ExpiredSignatureError)
def handle_expired_error(e):
    """处理 JWT 过期错误"""
    return create_error_response(401, "令牌已过期")


@app.errorhandler(NoAuthorizationError)
def handle_no_auth_error(e):
    """处理缺少授权头错误"""
    return create_error_response(401, "缺少授权头信息")


@app.errorhandler(JWTExtendedException)
def handle_jwt_extended_error(e):
    """处理其他 JWT 扩展错误"""
    return create_error_response(401, str(e))


@app.errorhandler(404)
def handle_not_found_error(e):
    """处理404错误"""
    return create_error_response(404, "资源未找到")


@app.errorhandler(500)
def handle_server_error(e):
    """处理500错误"""
    return create_error_response(500, "服务器内部错误")


@app.errorhandler(Exception)
def handle_general_exception(e):
    """处理所有其他未捕获的异常"""
    # 如果是已知的 JWT 错误，让专门的处理器处理
    if isinstance(e, (DecodeError, ExpiredSignatureError, NoAuthorizationError, JWTExtendedException)):
        return e
    
    app.logger.error(f"未处理的异常: {str(e)}")
    return create_error_response(500, f"服务器内部错误: {str(e)} {traceback.format_exc()}")


# 注册 API 特定的错误处理器
@api.errorhandler(Exception)
def handle_api_exception(e):
    """处理 API 特定的异常"""
    # 如果是已知的 JWT 错误，直接返回一个字典，而不是 Response 对象
    if isinstance(e, (DecodeError, ExpiredSignatureError, NoAuthorizationError, JWTExtendedException)):
        if isinstance(e, DecodeError):
            return {"message": "无效的令牌", "status": 401, "success": False}, 401
        elif isinstance(e, ExpiredSignatureError):
            return {"message": "令牌已过期", "status": 401, "success": False}, 401
        elif isinstance(e, NoAuthorizationError):
            return {"message": "缺少授权头信息", "status": 401, "success": False}, 401
        else:
            return {"message": str(e), "status": 401, "success": False}, 401
    
    app.logger.error(f"API 错误: {str(e)}")
    return {"message": str(e), "status": 500, "success": False}, 500
