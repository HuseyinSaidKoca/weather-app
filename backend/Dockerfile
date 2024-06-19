FROM  node:22-alpine3.19

RUN mkdir -p /home/app

RUN cd /home/app

COPY package*.json ./

RUN npm install --save

COPY index.js ./

EXPOSE 5000

CMD ["node","index.js"]