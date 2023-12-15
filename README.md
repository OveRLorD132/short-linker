# Short Linker

This app represents an API for a link shortener application.

The project contains:
  - Authentication
  - Link Shortener(add, delete, manage user's links)
  - Notifications

## Authentication

Authentication in short linker app uses JWT. User send his email and password and receives two JWT tokens.
User also can sing in using his email and password, and refresh tokens using refresh token.

## Link Shortener

To send requests to route /short-linker/ you need to be authenticated. You should include your token in Authentication Bearer header of your request.

### POST /short-linker/create-link

This route is used to create links. You will receive a 6-symbol code.

Example of request body

```json
{
    "originalLink": "https://music.youtube.com/", //Here you paste your link
    "timeToLive": "one-time"
}
```

Possible options of timeToLive:
1. "one-time" - creates one time link. It will be deleted after first use
2. "1d" - link will be deleted after 1 day.
3. "3d" - link will be deleted after 3 days.
4. "7d" - link will be deleted after 7 days.

### POST /short-linker/deactivate-link

Deletes short link by code.

Example of request body

```json
{
  "linkId": "you link id"
}
```

### GET /short-linker/links-list

Get a list of all user's links.

### GET /sh-lks/YOUR_LINK_CODE

Access to your short links by code.

## Notifications

Whenever link is deleted user who owns it receives an email.





