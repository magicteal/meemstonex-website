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
## Copy the standalone server files (server.js and package.json) into the runtime /app
COPY --from=build /app/.next/standalone/ ./
## Copy Next.js static assets
COPY --from=build /app/.next/static ./.next/static
## Copy the public folder
COPY --from=build /app/public ./public
## Copy production node_modules created during build stage (build had NODE_ENV=production)
COPY --from=build /app/node_modules ./node_modules

USER app
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
