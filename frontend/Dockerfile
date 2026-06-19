#<-----stage1--------->
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV GENERATE_SOURCEMAP=false
RUN npm run build

#<------stage2----->
FROM node:18-alpine
RUN npm install -g serve
COPY --from=builder /app/build /build
RUN adduser -S appuser
USER appuser
EXPOSE 3000
CMD ["serve","-s","/build"]
