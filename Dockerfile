FROM nginx:alpine
LABEL authors="Eric03742"
COPY src/ /usr/share/nginx/html/
EXPOSE 80
