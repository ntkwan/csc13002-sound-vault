FROM node:22-alpine

WORKDIR /soundvault/backend

COPY /backend/package*.json ./

COPY /contracts/Copyright.json ./

RUN npm install 

RUN npm install -g @babel/core @babel/cli @babel/preset-env @babel/node

COPY /backend .

RUN npm run build-src

CMD ["npm", "run", "build"]



