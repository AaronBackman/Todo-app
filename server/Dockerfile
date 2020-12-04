FROM node

RUN mkdir -p /home/server
COPY . /home/server/
WORKDIR "/home/server"
EXPOSE 9000
CMD ["node","bin/www"]