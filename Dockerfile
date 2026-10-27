FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
RUN mkdir /rootfs && cp dist/server /rootfs/server \
    && ldd dist/server | grep -o '/[^ ]*' | xargs -I{} cp -L --parents {} /rootfs

FROM scratch
COPY --from=build /rootfs /
ENTRYPOINT ["/server"]
