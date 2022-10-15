# ADN API 


## Install

    yarn install

## Run the app

    nodemon src/api/index.js



# REST API

The list of all endpoints for the API

## Get

### Request

`GET all posts`

    https://adnapinodejs.herokuapp.com/allposts

### Response

    "message": "POST_RETRIEVED_SUCCESSFULLY",
    "post": [
        {
            "_id": "634ab5913cadea56ea33ea55",
            "title": "ww",
            "pictures": [],
            "description": "ww",
            "supported_by": [],
            "created_by": "ww",
            "created_at": "2022-10-15T13:28:49.105Z",
            "__v": 0
        },

## Create a new Thing

### Request

`POST create a post`

    https://adnapinodejs.herokuapp.com/newpost

    {
    "title": "ww",
    "description": "ww",
    "created_by": "ww"
    }   

### Response
    {

        "message": "POST_ADDED_SUCCESFULLY",
        "post": {
            "_id": "634ab5913cadea56ea33ea55",
            "title": "ww",
            "pictures": [],
            "description": "ww",
            "supported_by": [],
            "created_by": "ww",
            "created_at": "2022-10-15T13:28:49.105Z",
            "__v": 0
    }
