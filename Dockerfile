FROM node:16 AS builder

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app ./

ENV AUTH_ACCESS_TOKEN=${{secrets.AUTH_ACCESS_TOKEN}} \
    AUTH_CLIENT_ID=${{secrets.AUTH_CLIENT_ID}} \
    AUTH_CLIENT_SECRETS=${{secrets.AUTH_CLIENT_SECRETS}} \
    DB_DATABASE=${{secrets.DB_DATABASE}} \
    DB_HOST=${{secrets.DB_HOST}} \
    DB_PASSWORD=${{secrets.DB_PASSWORD}} \
    DB_TYPE=${{secrets.DB_TYPE}} \
    DOCKERHUB_TOKEN=${{secrets.DOCKERHUB_TOKEN}} \
    DOCKERHUB_USERNAME=${{secrets.DOCKERHUB_USERNAME}} \
    JWT_EXPIRES_IN=${{secrets.JWT_EXPIRES_IN}} \
    JWT_SECRET_KEY=${{secrets.JWT_SECRET_KEY}} \
    PORT=${{secrets.PORT}} \
    S3_ACCESS_KEY_ID=${{secrets.S3_ACCESS_KEY_ID}} \
    S3_BUCKET_NAME=${{secrets.S3_BUCKET_NAME}} \
    S3_SECRET_ACEESS_KEY=${{secrets.S3_SECRET_ACEESS_KEY}}

EXPOSE 3000

CMD [ "npm", "run", "start:prod"  ]