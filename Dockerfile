FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration docker


FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=build /app/dist/mym-car-rental ./dist/mym-car-rental

EXPOSE 4000

CMD ["node", "dist/mym-car-rental/server/server.mjs"]