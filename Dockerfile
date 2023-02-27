FROM node:16 AS builder

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app ./

ENV AUTH_ACCESS_TOKEN=${AUTH_ACCESS_TOKEN} \
    AUTH_CLIENT_ID=${AUTH_CLIENT_ID} \
    AUTH_CLIENT_SECRETS=${AUTH_CLIENT_SECRETS} \
    DB_DATABASE=${DB_DATABASE} \
    DB_HOST=${DB_HOST} \
    DB_PASSWORD=${DB_PASSWORD} \
    DB_TYPE=${DB_TYPE} \
    DOCKERHUB_TOKEN=${DOCKERHUB_TOKEN} \
    DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME} \
    JWT_EXPIRES_IN=${JWT_EXPIRES_IN} \
    JWT_SECRET_KEY=${JWT_SECRET_KEY} \
    PORT=${PORT} \
    S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID} \
    S3_BUCKET_NAME=${S3_BUCKET_NAME} \
    S3_SECRET_ACEESS_KEY=${S3_SECRET_ACEESS_KEY} \
    AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
    AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

RUN npm i aws-cli
    
RUN aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID} && \
    aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY} && \
    aws configure set region ap-northeast-2 && \
    aws configure set format json

EXPOSE 3000

CMD [ "npm", "run", "start:prod"  ]