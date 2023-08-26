# Spotify Lyrics Backend

[![Deployment](https://github.com/magnuspaal/spotify-lyrics-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/magnuspaal/spotify-lyrics-backend/actions/workflows/ci.yml)

[DEMO](https://spotify.magnuspaal.com/)

## Development

1. Install dependencies `npm install`
2. Run `docker-compose -f docker-compose.mongo-dev.yml up -d`
3. Copy `.env.example` to `.env` and define Spotify client id and secret.
4. Start the backend with `npm run start`

## Production

1. Run `npm version [major,minor,patch]`
2. Push resulting commit and tag. Github Actions will deploy application on new tag push.
