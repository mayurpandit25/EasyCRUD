FROM node:24-alpine

COPY . /opt/
WORKDIR /opt

RUN npm install
RUN npm run build

RUN apk add --no-cache apache2

RUN rm -rf /var/www/localhost/htdocs/*
RUN cp -r dist/* /var/www/localhost/htdocs/

EXPOSE 80

CMD ["httpd","-D","FOREGROUND"]
