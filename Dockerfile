# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
# Install production dependencies only (vite is now in dependencies)
RUN npm ci --only=production

# Build the application
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
# Build both frontend and backend (vite is now in dependencies)
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5013

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
# Server build output is in dist/
# Frontend build output is in dist/public/
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set proper permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 5013

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5013/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))" || exit 1

CMD ["npm", "start"]