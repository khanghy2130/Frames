# Frames

![featured image][img1]

[img1]: https://github.com/khanghy2130/final_portfolio/blob/master/project-images/frames.png "featured image"


## Tools used
+ __React, Next.js:__ Making server-side-rendering (SSR) with React possible.
+ __Node.js, Express.js:__ Develop backend using Javascript.
+ __MongoDB, mongoose:__ Non-relational database.
+ __GraphQL, Apollo:__ Only delivers what client needs.
+ __SASS:__ "CSS with superpowers".
+ __Okta:__ Third party authentication intergation.
+ __GIPHY, DiceBear Avatars:__ External APIs that supply the contents.

## Get started
#### Requirements:
+ A clone of this repo.
+ Node.js and NPM installed.
+ A running mongoDB server to connect to.
+ Okta setup.
+ GIPHY API key.
#### Setup:
Create a file named `.env`. Copy the following keys and fill in the `[..values]`:
```
# 'development' or 'production'
NODE_ENV=[..environment]

# MongoDB server
DBURL=[..MongoDB server url]

API_KEY=[..GIPHY API key]

# OKTA setup
session_secret=[..secret string]
OIDC_appBaseUrl=[..]
OIDC_issuer=[..]
OIDC_client_id=[..]
OIDC_client_secret=[..]
OIDC_redirect_uri=[..]
```

## Scripts
+ __npm run dev__: Start the app in development mode. Make sure `NODE_ENV` in `.env` is `development`.
+ __npm run build__ then __npm run start__: Build the pages and start the app in production mode. Make sure `NODE_ENV` in `.env` is `production`.