# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# If there are production dependencies, use the following instead
# RUN npm ci --only=production

# Bundle the app source inside the Docker image
COPY . .

RUN npm rebuild @tensorflow/tfjs-node --update-binary

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define the command to run the app
CMD [ "npm", "start" ]