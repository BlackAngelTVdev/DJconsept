# Dockerfile
FROM node:25-alpine

WORKDIR /root
COPY . .

RUN npm install

ARG PORT
ENV PORT=$PORT
EXPOSE $PORT

RUN chmod +x start.sh
CMD ["./start.sh"]
