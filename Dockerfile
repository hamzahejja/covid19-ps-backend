FROM node:12.16.2

# Create app directory
WORKDIR /app

# Copy package.json, package-lock.json to app to install app dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "dist/index.js" ]
