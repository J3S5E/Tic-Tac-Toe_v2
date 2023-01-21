# syntax=docker/dockerfile:1
FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
ENV NODE_ENV=production
RUN --mount=type=secret,id=DATABASE_URL \
  ENV DATABASE_URL=$(cat /run/secrets/DATABASE_URL)
RUN --mount=type=secret,id=WEB_CLIENT_URL \
  ENV WEB_CLIENT_URL=$(cat /run/secrets/WEB_CLIENT_URL)
CMD ["npm", "run", "start"]