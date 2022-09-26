# Getting started with Sing Me A Song

## `Settings:`


## .env 

```yml 
### DATABASE_URL
 - postgres://user:password@host:port/database_name

### PORT=port number
 - Default 5000
```

## .env.test

```yml 
### DATABASE_URL
 - postgres://user:password@host:port/database_name

### PORT=port number
 - Default 5000

### NODE_ENV
 - TEST
```

## Run
```yml 
 - npm install
 - npm run prisma
 - npm run dev
 ```

#
## ROUTES

```yml 
POST /recommendations
    - Route to add a recommendation 
    - body: {
        "name": "lorem",
        "youtubeLink": "loremipsum"
      }
```

```yml 
POST /recommendations/:id/upvote
    - Route to upvote a recommendation
    - body: {}
```

```yml 
POST /recommendations/:id/downvote
    - Route to downvote a recommendation
    - body: {}
```

```yml 
GET /recommendations/:id
    - Route to get a recommendation by ID
    - body: {}
    - response: {
        "id": 0,
        "name": "loremipsum",
        "youtubeLink": "loremipsum",
        "score": 0
      }
```

```yml 
GET /recommendations/random
    - Route to get a random recommendation
    - body: {}
    - response: {
        "id": 0,
        "name": "loremipsum",
        "youtubeLink": "loremipsum",
        "score": 0
      }
```

```yml 
GET /recommendations/top/:amount
    - Route to get top :amount recommendations
    - body: {}
    - response: [
        {
          "id": 0,
          "name": "loremipsum",
          "youtubeLink": "loremipsum",
          "score": 0
        },
      ]
```

```yml 
GET /recommendations
    - Route to get all recommendations
    - body: {}
    - response: [
        {
          "id": 0,
          "name": "loremipsum",
          "youtubeLink": "loremipsum",
          "score": 0
        },
      ]
```

```yml 
DELETE /recommendations/reset-database
    - Route to get all recommendations (only to tests)
    - body: {}
```