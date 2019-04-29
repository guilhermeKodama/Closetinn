FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install apidoc -g
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
ADD . .

# set env variables
ENV NODE_ENV production
# ENV PORT 443
ENV PORT 80
# ENV HTTPS true

EXPOSE 443
EXPOSE 80

CMD [ "npm", "start" ]
