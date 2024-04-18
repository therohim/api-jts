FROM node:20.12.2-alpine3.19

# Create app directory
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./

# NPM install
RUN npm install

# Copy all files
COPY . /app

EXPOSE 3000

CMD ["npm", "run", "start:dev"]