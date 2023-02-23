FROM node:16 AS builder

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD [ "npm", "run", "start:prod"  ]