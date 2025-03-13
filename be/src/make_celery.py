"""
@Time: 2024/12/08 20:00
@Author: Amagi_Yukisaki
@File: make_celery.py
"""

import os

# 检查是否启用了简单模式（不使用Celery）
SIMPLE_MODE = os.environ.get("SIMPLE_MODE", "False") == "True"

# 只有在非简单模式下才初始化Celery
if not SIMPLE_MODE:
    from app import create_app
    
    flask_app, _ = create_app()
    celery_app = flask_app.extensions["celery"]
else:
    # 在简单模式下提供一个空的占位符
    celery_app = None
