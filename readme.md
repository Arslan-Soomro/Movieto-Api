# Movieto API
Api for movieto, that displays movies and creates watchlist for users. Although this api is designed to be used with a specific app, It's different endpoints are publics, hence those public routes can be used by any app. For example, the movie route can be used to fetch and display different movies, regardless of the app used.

## Movie Route

- GET  `/movie` \
For getting a random movie
- GET `/movie/all?page=<page_number>` \
For getting 20 movies at a time, different movies can be fetched by using different page numbers.
- GET `/movie/count` \
Responds with the number of movies available in the database and how many pages can be created from them.

## User Route
- POST `/user/signup` \
Adds a user to the database, It requires following parameters in body of the request. \
`full_name`, `user_name`, `password`, `email`
parameters are self explanatory.

- POST `/user/login` \
logs a user in generating a token or returns the user's data. \
If the request body contains valid `user_name` and `password` then the router responds with a token that can be stored and used to access routes that need authentication. \
If the request body contains valid `token` parameter then the route returns the user's data.

- POST `/user/update` (Secure Route) \
Requires `token` body parameter. send all or any parameters concerned with user's data and it updates them.

- POST `/user/delete` (Secure Route) \
 Requires `token` body parameter. Deletes the user associated with received token from database.

## Watchlist Routes

- POST `/watchlist` (Secure Route) \
Requires `token` body parameter. Responds with the watchlist of the user associated with the token.

- POST `/watchlist/add` (Secure Route) \
Requires `token` body parameter. Request body must contain `movie_id` of the movie that needs to be added to watchlist of the user associated with the token.

- POST `/watchlist/remove` (Secure Route) \
Requires `token` body parameter. Request body must contain `movie_id` of the movie that needs to be removed from watchlist of the user associated with the token.
