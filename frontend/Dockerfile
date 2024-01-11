# Use the official Node image as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the local code to the container
COPY . .

# Install dependencies
RUN npm install

# Expose the port your React app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]