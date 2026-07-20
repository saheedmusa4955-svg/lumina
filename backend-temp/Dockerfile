FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install native dependencies for some node modules like bcrypt or sqlite if needed
RUN apk add --no-cache python3 make g++ sqlite openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the TypeScript code
RUN npm run build

# Create uploads directory and ensure it has correct permissions
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Define a volume for uploaded images (like KYC) to persist across container restarts
VOLUME ["/app/uploads"]

# Command to run the application
CMD ["npm", "start"]
