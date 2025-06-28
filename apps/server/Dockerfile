# Multi-stage build for yarn workspace
FROM node:20.17-alpine AS base
WORKDIR /app

# Install dependencies stage
FROM base AS deps

# Copy root package.json and yarn.lock
COPY package.json yarn.lock ./

# Copy server package.json
COPY apps/server/package.json ./apps/server/package.json

# Install all dependencies (needed for workspace resolution)
RUN yarn install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app

# Copy source code
COPY . .

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Build the server (if you have a build step)
RUN yarn workspace server build 2>/dev/null || echo "No build script found, copying source files"

# Production stage
FROM node:20.17-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy built application or source files
COPY --from=builder --chown=nodejs:nodejs /app/apps/server ./

# Install only production dependencies for server
RUN yarn install --frozen-lockfile --production=true && yarn cache clean
USER nodejs
EXPOSE 5000
CMD ["node", "index.js"]
