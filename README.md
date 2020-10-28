# ubisoft-full-stack-backend-test
## SET UP
This project use NodeJS and MongoDB <br>
To run this project please install:
* NodeJS from https://nodejs.org/en/download/ <br>
* MongoDB from https://docs.mongodb.com/manual/administration/install-community/

[//]: # (Hello)
Run steps
1. Clone this repository
1. Open terminal right in repository folder
1. Please run 'npm install' to install neccessary depenendcies
1. Run 'npm start' to run app

#### To change database:
Edit the connection string in <b>line 16</b> file <b>app.js</b>
```javascript

const connectionString = `your MongoDB connection string`


```
## FRONTEND
Connect "/web" to access web client, it provides CRUD tools to insert and modify data
<br>Example: "localhost:8080/web"
## BACKEND

#### Provide an API to know all the game information and upcoming events: (GET) "/api/game/info"
* Parameter:
  * "id": Game ID (24 character length string)
* Example: localhost:8080/api/game/info?id=5f99327e232d89ad46c8e24e
###
Expect result: 
```json
{
    "_id": "5f99327e232d89ad46c8e24e",
    "name": "Test Game 2",
    "initialData": {
        "coin": 200,
        "star": 3
    },
    "happeningEvent": [
        {
            "reward": {
                "star": 10
            },
            "rewardedUsers": [],
            "_id": "5f9933c2232d89ad46c8e257",
            "name": "Event 2 Game 2",
            "game": "5f99327e232d89ad46c8e24e",
            "startDate": "2020-10-14T00:00:00.000Z",
            "endDate": "2020-11-10T00:00:00.000Z",
            "enable": true,
            "__v": 0
        }
    ],
    "comingUpEvent": [
        {
            "reward": {
                "star": 11
            },
            "rewardedUsers": [],
            "_id": "5f9933dd232d89ad46c8e258",
            "name": "Event 3 Game 2",
            "game": "5f99327e232d89ad46c8e24e",
            "startDate": "2020-11-24T00:00:00.000Z",
            "endDate": "2020-12-12T00:00:00.000Z",
            "enable": true,
            "__v": 0
        }
    ]
}
```

#### Provide an API to get a player’s information in a specific game: (GET) "/api/user/getUserGameData"
* Parameter:
  * "userId": user ID (24 character length string)
  * "gameId": game ID (24 character length string)
* Example: "localhost:8080/api/user/getUserGameData?userId=5f9932ca232d89ad46c8e250&gameId=5f993274232d89ad46c8e24d"
###
Expect Result:
```json
{
    "_id": "5f9932ca232d89ad46c8e250",
    "name": "User 1",
    "recentLoginTime": "2020-10-28T09:05:45.825Z",
    "gameData": {
        "_id": "5f993274232d89ad46c8e24d",
        "data": {
            "coin": 100,
            "star": 4
        }
    }
}
```
#### Provide an API to update a player’s information in a specific game: (PATCH) "/api/user/updateUserGameData" 
Example body data (JSON): 
```json
{
    "userId": "5f9932ca232d89ad46c8e250",
    "gameId": "5f993274232d89ad46c8e24d",
    "gameData": {
            "coin": 100,
            "star": 2
        }
}
```
###
Expect Result:
```json
{
    "_id": "5f9932ca232d89ad46c8e250",
    "name": "User 1",
    "recentLoginTime": "2020-10-28T09:05:45.825Z",
    "gameData": {
        "_id": "5f993274232d89ad46c8e24d",
        "data": {
            "coin": 100,
            "star": 2
        }
    }
}
```
#### Provide an API to get rewards from players when the event completes: (GET) "/event/rewardPlayer"
* Parameter:
  * "userId": user ID (24 character length string)
  * "eventId": event ID (24 character length string)
* Example: "localhost:8080/api/event/rewardPlayer?userId=5f9932cd232d89ad46c8e251&eventId=5f9933a9232d89ad46c8e256"
###
Expect Result:
```json
{
    "_id": "5f9932cd232d89ad46c8e251",
    "name": "User 2",
    "recentLoginTime": "2020-10-28T09:06:37.938Z",
    "reward": {
        "star": 7
    },
    "gameData": {
        "_id": "5f99327e232d89ad46c8e24e",
        "data": {
            "coin": 200,
            "star": 10
        }
    }
}
```



