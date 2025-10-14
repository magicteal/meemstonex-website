# Production Dockerfile for meemstonex-website
# 1. Build stage
FROM node:20-alpine AS build
WORKDIR /app
ENV NODE_ENV=production

# Install dependencies separately to leverage layer caching
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Copy source
COPY . .

# Build (standalone for smaller runtime image)
RUN npm run build

# 2. Runtime stage
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy only needed build artifacts and production deps
COPY --from=build /app/package.json ./
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

USER app
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
