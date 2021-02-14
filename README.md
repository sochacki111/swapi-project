# swapi-project

## Requirements
Docker installed on your machine

## Installation
Run following commands in project root directory:
```sh
cd server
docker-compose build
docker-compose up
```

## Documentation
Every endpoint is documented using Swagger under http://localhost:8080/api-docs/

## Usage Example
There are five resources user can get:
- films
- species
- vehicles
- starships
- planets
These are resources from Star Wars universe provided by https://swapi.dev/

In order to get any of the resource you need to create an account first:
```sh
curl -X POST "http://localhost:8080/api/auth/register" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"email\":\"example@email.com\",\"password\":\"toor\"}"
```
Successful response will return you something like:
```sh
{
  "_id": "6019bb4ec7a8c86dc89302c0", <- this is an id of your account
  "email": "example@email.com", <- this is your email
  "swapiHeroId": "58" <- this is an id of hero from star wars universe assigned to your account at random
}
```
Next login to your account:
```sh
curl -X POST "http://localhost:8080/api/auth/signin" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"email\":\"example@email.com\",\"password\":\"toor\"}"
```
Successful response will return you something like:
```sh
{
  "_id": "6019bb4ec7a8c86dc89302c0",
  "email": "example@email.com",
  "idToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMTliYjRlYzdhOGM4NmRjODkzMDJjMCIsImVtYWlsIjoiZXhhbXBsZUBlbWFpbC5jb20iLCJpYXQiOjE2MTMyMjc3OTAsImV4cCI6MTYxMzIzMTM5MH0.F2UTmIXyp9v4fQr62888DTgGadbwe8HMnB7B45CMwO8",
  "expiresIn": "3600"
}
```
The server returned you JWT token "idToken" which you need to append to every request to get resource. E.g. lets try to get films from star wars universe. Notice how the token is appended to that request. It's ```-H  "Authorization: Bearer <tokenId>"```
```sh
curl -X GET "http://localhost:8080/api/films" -H  "accept: application/json" -H  "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMTliYjRlYzdhOGM4NmRjODkzMDJjMCIsImVtYWlsIjoiZXhhbXBsZUBlbWFpbC5jb20iLCJpYXQiOjE2MTMyMjc3OTAsImV4cCI6MTYxMzIzMTM5MH0.F2UTmIXyp9v4fQr62888DTgGadbwe8HMnB7B45CMwO8"
```
Successful response will return you something like:
```sh
[
  {
    "id": "1",
    "title": "A New Hope"
  },
  {
    "id": "2",
    "title": "The Empire Strikes Back"
  },
  {
    "id": "3",
    "title": "Return of the Jedi"
  },
  {
    "id": "6",
    "title": "Revenge of the Sith"
  }
]
```

Please follow the API documentation available at http://localhost:8080/api-docs/


## Technologies
- TypeScript ✅
- Express.js ✅
- MongoDB ✅
- Passport.js (JWT authorization) ✅
- pino, morgan (logging) ✅
- Redis (request caching) ✅
- Docker ✅
- Swagger (API Documentation) ✅
