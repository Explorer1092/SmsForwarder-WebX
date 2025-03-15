# 使用多阶段构建

# 第一阶段：构建前端
FROM node:22 AS frontend-builder

ADD ./fe/package.json /app/package.json
ADD ./fe/yarn.lock /app/yarn.lock
WORKDIR /app
RUN yarn install

ADD ./fe /app
# 设置前端 API 地址为空，这样会使用相对路径
ENV REACT_APP_BACKEND_URL=""
RUN yarn build

# 第二阶段：构建后端并整合前端
FROM python:3.12-slim

# 安装后端依赖
WORKDIR /app
COPY ./be/requirements.txt .
RUN pip install -r requirements.txt

# 复制后端代码
COPY ./be/src /app
COPY ./be/entrypoint.sh /app/

# 复制前端构建文件到静态目录
COPY --from=frontend-builder /app/build /app/static

# 创建数据目录
RUN mkdir -p /app/data

# 设置权限
RUN chmod +x /app/entrypoint.sh

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["/app/entrypoint.sh"]
