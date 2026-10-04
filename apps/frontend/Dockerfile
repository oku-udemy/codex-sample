FROM node:22-alpine

WORKDIR /workspace

COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--workspace", "@todo/frontend", "--", "--host", "0.0.0.0"]

