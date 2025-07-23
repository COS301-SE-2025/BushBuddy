## File structure for API

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
