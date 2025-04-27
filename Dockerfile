# Stage 1: Build the Next.js application
FROM node:18-alpine3.17 AS builder

# Create and change to the app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Disable telemetry
RUN npx next telemetry disable

# Build the Next.js application
RUN npm run build

# Stage 2: Create the final image for running the standalone Next.js application
FROM node:18-alpine3.17 AS runner

# Create and change to the app directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Install only production dependencies
RUN npm install --only=production

# Expose port 3000
EXPOSE 3000

# Run the Next.js application
CMD ["node", "server.js"]