FROM node:22-alpine as dependencies-env
RUN npm i -g pnpm
COPY . /app

FROM dependencies-env as development-dependencies-env
COPY ./package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
WORKDIR /app
RUN pnpm i --frozen-lockfile

FROM dependencies-env as production-dependencies-env
COPY ./package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
WORKDIR /app
RUN pnpm i --prod --frozen-lockfile

FROM dependencies-env AS build-env
COPY ./package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN pnpm build

FROM dependencies-env
COPY ./package.json pnpm-lock.yaml pnpm-workspace.yaml database.sqlite /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/dist /app/dist
WORKDIR /app
CMD ["pnpm", "start"]