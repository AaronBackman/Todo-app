FROM node

RUN mkdir -p /home/client
COPY . /home/client
WORKDIR "/home/client"
EXPOSE 3000
CMD ["node","scripts/start.js"]