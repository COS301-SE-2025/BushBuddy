# File structure for API

## Introduction

### server.js

Main API server file that runs the server

### app.js

Combines the routers from the routes folder and connects them to server.js

### routes

All API endpoint routing will happen here.

### controllers

Strictly only HTTP request handling (no logic) happens here

### services

If any API endpoints/controllers need additional logic or multiple DB queries, these will be handled here

### repositories

All functions that query the database will be housed here

### db

Holds the database connection file

## Specification

### Authentication Server

#### auth/register

Method: `POST`

Request body  
| Field | Required | Type | Description |
| ----- | -------- | ----------- | ---- |
| Username | yes | String | New user's username |
| Email | yes | String | New user's email address |
| Password | yes | String | New user's password |

N.B it is recommended to validate inputs in the frontend before sending a request, however the email and password fields will be checked for valid format in the backend.

Request Response
| Field | Description |
| ----- | ----------- |
| status | Indicates success or failure of request |
| message | If request is successful, a meaningful message is attached |
| error | If request fails, an error message is attached |

N.B on successful register, an HTTP-only cookie holding the user's JWT is also attached in the response

#### auth/login

Method: `POST`

Request body  
| Field | Required | Type | Description |
| ----- | -------- | ----------- | ---- |
| Username | yes | String | Returning user's username |
| Password | yes | String | Returning user's password |

Request Response
| Field | Description |
| ----- | ----------- |
| status | Indicates success or failure of request |
| message | If request is successful, a meaningful message is attached |
| error | If request fails, an error message is attached |

N.B on successful login, an HTTP-only cookie holding the user's JWT is also attached in the response

#### auth/logout

Method: `POST`

Request Body `None`

Request Headers

- include `credentials: "include"` in the request headers to include the JWT stored in the HTTP-only cookie in the request

Request Response
| Field | Description |
| ----- | ----------- |
| status | Indicates success or failure of request |
| message | If request is successful, a meaningful message is attached |
| error | If request fails, an error message is attached |

N.B. on successful logout, the cookie storing the JWT will be deleted
