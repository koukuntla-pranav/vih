FROM node:slim

# Set working directory
WORKDIR /app

# Copy package files first
COPY backend/package*.json ./backend/

# Install dependencies
WORKDIR /app/backend
RUN npm install

# Go back to root and copy the entire project (frontend + backend)
WORKDIR /app
COPY . .

# Expose the port
EXPOSE 5000

# Set the working directory for the command execution
WORKDIR /app/backend

# Run the backend
CMD ["npm", "start"]
