# Outside Digital
[Посмотреть тестовое задание](./docs/TestTask.md)

## Docker

> Make environment variables (see docker-compose.yaml)

```bash
docker-compose up
```

## Build

> Make environment variables (see .env.example)

> We use node version 16+

Download the dependencies:

```bash
npm ci
```

To run compile the Typescript:

```bash
npm run build
```

Remove dependencies for development:

```bash
npm ci --omit=dev
```

To run the application:

```bash
npm run start:prod
```
