# home-dashboard

## Development

Node.js 24 and Yarn Classic are required. With [mise](https://mise.jdx.dev/):

```sh
mise install
yarn install
cp .env.example .env
```

Fill in the Google OAuth and OpenWeather values in `.env`. In Google Cloud
Console, create a **Web application** OAuth client and add this exact authorized
redirect URI:

```text
https://localhost:3000
```

The scheme, hostname, port, and path must exactly match
`GOOGLE_OAUTH_CLIENT_REDIRECT_URI` in `.env`.

Run the API and frontend in separate terminals:

```sh
yarn apiserve
yarn dev
```

The frontend is available at `https://localhost:3000` and proxies
`/api` requests to `http://localhost:3001`.

Before committing changes, run:

```sh
yarn typecheck
yarn build
```
