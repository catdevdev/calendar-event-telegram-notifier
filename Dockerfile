# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# If you're using Prisma, run Prisma migrations
RUN npx prisma migrate dev --name init

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]
