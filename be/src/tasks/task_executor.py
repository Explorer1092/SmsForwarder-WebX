"""
@Time: 2025/03/13 18:30
@Author: Cascade
@File: task_executor.py
"""

import os
import logging
from functools import wraps

logger = logging.getLogger(__name__)

# 检查是否启用了简单模式（不使用Celery）
SIMPLE_MODE = os.environ.get("SIMPLE_MODE", "False") == "True"


class TaskExecutor:
    """
    任务执行器，用于在简单模式下直接执行任务，或在正常模式下通过Celery执行任务
    """
    @staticmethod
    def execute_task(task_func, args):
        """
        执行任务的通用方法
        
        Args:
            task_func: 任务函数
            args: 任务参数
        """
        if SIMPLE_MODE:
            # 简单模式下直接执行任务
            logger.info(f"直接执行任务: {task_func.__name__}")
            try:
                task_func(args)
            except Exception as e:
                logger.error(f"任务执行失败: {e}")
        else:
            # 正常模式下通过Celery执行任务
            logger.info(f"通过Celery执行任务: {task_func.__name__}")
            task_func.delay(args)


def task_or_direct(func):
    """
    装饰器，根据SIMPLE_MODE决定是直接执行函数还是作为Celery任务执行
    
    Args:
        func: 要装饰的函数
        
    Returns:
        装饰后的函数
    """
    # 创建一个模拟的delay方法
    def delay_method(args):
        return func(args)
    
    # 为原始函数添加delay属性
    func.delay = delay_method
    
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    
    return wrapper
