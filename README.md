# swapi-project
Node.js REST API that makes use of the resources from the Star Wars universe provided by https://swapi.dev/. It randomly assigns the Star Wars hero to registered user. Based on that assignment the user will gain access to Star wars resources associated with that hero. API caches every request to SWAPI using Redis which reduces server response time.

## Requirements
Docker installed on your machine

## Technologies
✅ TypeScript  
✅ Express.js  
✅ MongoDB  
✅ Passport.js (JWT authorization)  
✅ pino, morgan (logging)  
✅ Redis (request caching)  
✅ Docker  
✅ Swagger (API Documentation)  

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

These are resources from the Star Wars universe provided by https://swapi.dev/

### 1. Registering an account
In order to get any of the resource you need to create an account first:
```sh
curl -X POST "http://localhost:8080/api/auth/register" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"email\":\"example@email.com\",\"password\":\"toor\"}"
```
A successful response will return you something like:
```sh
{
  "_id": "6019bb4ec7a8c86dc89302c0", <- this is an id of your account
  "email": "example@email.com", <- this is your email
  "swapiHeroId": "1", <- this is an id of hero from star wars universe assigned to your account at random
  "swapiHeroName": "Luke Skywalker" <- this is assigned hero name
}
```
⚠️ Important ⚠️
Note that as you register your account will be assigned to random hero from star wars universe. This is important in the context of getting resources later. Only resources that are in any way related to that hero will be returned.
### 2. Logging to account
```sh
curl -X POST "http://localhost:8080/api/auth/signin" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"email\":\"example@email.com\",\"password\":\"toor\"}"
```
A successful response will return you something like:
```sh
{
  "_id": "6019bb4ec7a8c86dc89302c0",
  "email": "example@email.com",
  "idToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMTliYjRlYzdhOGM4NmRjODkzMDJjMCIsImVtYWlsIjoiZXhhbXBsZUBlbWFpbC5jb20iLCJpYXQiOjE2MTMyMjc3OTAsImV4cCI6MTYxMzIzMTM5MH0.F2UTmIXyp9v4fQr62888DTgGadbwe8HMnB7B45CMwO8",
  "expiresIn": "3600"
}
```
### 3. Getting resource list
The server returned you JWT token "idToken" which you need to append to every request to get a resource. E.g. let's try to get films from star wars universe. Notice how the token is appended to that request. It's ```-H  "Authorization: Bearer <tokenId>"```
```sh
curl -X GET "http://localhost:8080/api/films" -H  "accept: application/json" -H  "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMTliYjRlYzdhOGM4NmRjODkzMDJjMCIsImVtYWlsIjoiZXhhbXBsZUBlbWFpbC5jb20iLCJpYXQiOjE2MTMyMjc3OTAsImV4cCI6MTYxMzIzMTM5MH0.F2UTmIXyp9v4fQr62888DTgGadbwe8HMnB7B45CMwO8"
```
A successful response will return you something like:
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
⚠️ Important ⚠️
Your result may vary from the example. It depends on which star wars hero was assigned to your profile. In our example 'Luke Skywalker' appeared in these four films, hence the results of that request

### 4. Getting resource details
Based on our previous example we can notice that we have access to film of id "1". Let's try to get details about this film:
```sh
curl -X GET "http://localhost:8080/api/films/1" -H  "accept: application/json"
```
A successful response will look like this:
```sh
{
  "title": "A New Hope",
  "episode_id": 4,
  "opening_crawl": "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
  "director": "George Lucas",
  "producer": "Gary Kurtz, Rick McCallum",
  "release_date": "1977-05-25",
  "characters": [
    {
      "id": "1",
      "name": "Luke Skywalker",
      "hasAccess": true
    },
    {
      "id": "2",
      "name": "C-3PO",
      "hasAccess": false
    },
    {
      "id": "3",
      "name": "R2-D2",
      "hasAccess": false
    },
    {
      "id": "4",
      "name": "Darth Vader",
      "hasAccess": false
    },
    {
      "id": "5",
      "name": "Leia Organa",
      "hasAccess": false
    },
    {
      "id": "6",
      "name": "Owen Lars",
      "hasAccess": false
    },
    {
      "id": "7",
      "name": "Beru Whitesun lars",
      "hasAccess": false
    },
    {
      "id": "8",
      "name": "R5-D4",
      "hasAccess": false
    },
    {
      "id": "9",
      "name": "Biggs Darklighter",
      "hasAccess": false
    },
    {
      "id": "10",
      "name": "Obi-Wan Kenobi",
      "hasAccess": false
    },
    {
      "id": "12",
      "name": "Wilhuff Tarkin",
      "hasAccess": false
    },
    {
      "id": "13",
      "name": "Chewbacca",
      "hasAccess": false
    },
    {
      "id": "14",
      "name": "Han Solo",
      "hasAccess": false
    },
    {
      "id": "15",
      "name": "Greedo",
      "hasAccess": false
    },
    {
      "id": "16",
      "name": "Jabba Desilijic Tiure",
      "hasAccess": false
    },
    {
      "id": "18",
      "name": "Wedge Antilles",
      "hasAccess": false
    },
    {
      "id": "19",
      "name": "Jek Tono Porkins",
      "hasAccess": false
    },
    {
      "id": "81",
      "name": "Raymus Antilles",
      "hasAccess": false
    }
  ],
  "planets": [
    {
      "id": "1",
      "name": "Tatooine",
      "hasAccess": true
    },
    {
      "id": "2",
      "name": "Alderaan",
      "hasAccess": false
    },
    {
      "id": "3",
      "name": "Yavin IV",
      "hasAccess": false
    }
  ],
  "starships": [
    {
      "id": "2",
      "name": "CR90 corvette",
      "hasAccess": false
    },
    {
      "id": "3",
      "name": "Star Destroyer",
      "hasAccess": false
    },
    {
      "id": "5",
      "name": "Sentinel-class landing craft",
      "hasAccess": false
    },
    {
      "id": "9",
      "name": "Death Star",
      "hasAccess": false
    },
    {
      "id": "10",
      "name": "Millennium Falcon",
      "hasAccess": false
    },
    {
      "id": "11",
      "name": "Y-wing",
      "hasAccess": false
    },
    {
      "id": "12",
      "name": "X-wing",
      "hasAccess": true
    },
    {
      "id": "13",
      "name": "TIE Advanced x1",
      "hasAccess": false
    }
  ],
  "vehicles": [
    {
      "id": "4",
      "name": "Sand Crawler",
      "hasAccess": false
    },
    {
      "id": "6",
      "name": "T-16 skyhopper",
      "hasAccess": false
    },
    {
      "id": "7",
      "name": "X-34 landspeeder",
      "hasAccess": false
    },
    {
      "id": "8",
      "name": "TIE/LN starfighter",
      "hasAccess": false
    }
  ],
  "species": [
    {
      "id": "1",
      "name": "Human",
      "hasAccess": false
    },
    {
      "id": "2",
      "name": "Droid",
      "hasAccess": false
    },
    {
      "id": "3",
      "name": "Wookie",
      "hasAccess": false
    },
    {
      "id": "4",
      "name": "Rodian",
      "hasAccess": false
    },
    {
      "id": "5",
      "name": "Hutt",
      "hasAccess": false
    }
  ]
}
```
⚠️ Important ⚠️
Besides simple information about the film. The returned object contains also lists of associated resources like characters, planets, starship, vehicles and species. Each object of the list contains "hasAccess" property which designates whether the currently logged in user has access to details of that resource.

*To get the full experience from working with the API please follow the API documentation available at http://localhost:8080/api-docs/*
