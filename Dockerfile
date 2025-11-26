# Dockerfile

FROM node:25-alpine

WORKDIR /root
COPY . .

RUN npm install

ARG PORT
EXPOSE $PORT

RUN chmod +x start.sh
CMD ["./start.sh"]
