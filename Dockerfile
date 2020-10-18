FROM node:10-alpine as builder
# RUN mkdir -p /app
# WORKDIR /app
# COPY package.json /app
# RUN npm install
# COPY . /app
# RUN npm run build --prod

FROM nginx:alpine
# COPY --from=builder /app/dist/project-folder-name/* /var/www/html/project-folder-name/
COPY ./dist/project-folder-name /var/www/html/project-folder-name
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx:nginx /var/www/html
EXPOSE 80
