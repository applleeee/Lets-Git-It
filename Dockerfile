FROM node:16 AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app ./
ENV PORT=3000 \
    DB_TYPE=mysql \
    DB_HOST=127.0.0.1 \
    DB_PORT=3306 \
    DB_USERNAME=root \
    DB_PASSWORD=123 \
    DB_DATABASE=git_rank \
    S3_ACCESS_KEY_ID=AKIAW4FHCOMUCKR7PVGR \
    S3_SECRET_ACEESS_KEY=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 \
    S3_BUCKET_NAME=git-rank \
    JWT_SECRET_KEY=git_rank \
    JWT_EXPIRES_IN=30m \
    GITHUB_CLIENT_ID=33321e05acfcbd0b361b \
    GITHUB_CLIENT_SECRETS=455a5d38b02d91c57256f00359c2f1262277d2fc \
    GITHUB_ACCESS_TOKEN=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
EXPOSE $PORT
CMD [ “npm”, “run”, “start:prod”  ]