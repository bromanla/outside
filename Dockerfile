FROM node:16-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
COPY --from=builder /usr/src/app/dist ./dist
CMD ["node", "./dist/main.js"]
