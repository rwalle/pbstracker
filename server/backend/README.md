# Instructions

Instructions are in the respective folders of the backend software.

## Deploy to Firebase (build the same server as the demo app)

1. Get a MongoDB server. Examples include [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Follow all the instructions from Google before deploying. Make sure to use "Hosting" and "Functions" features for your app, and you may need to be on the "Blaze" plan to allow connections to external database.
3. Copy everything in the `nodejs/server` folder to `functions` folder under the Firebase directory. Rename `server.js` to `index.js`. In this file, add `const functions = require('firebase-functions');` at the beginning, point `dbRouter` variable to your database, change basic auth credentials, and replace the last line with `exports.app = functions.https.onRequest(app);`.
4. Modify frontend files as needed, build production frontend files, and copy them to `public` folder under the Firebase directory.
5. In `firebase.json`, include the following "hosting" rules:
```json
  "hosting": {
    "public": "public",
    "rewrites": [ {
      "source": "/api/",
      "function": "app"
    },
    {
      "source": "/api/*/",
      "function": "app"
    },
    {
      "source": "/api/*/*/",
      "function": "app"
    },
    {
      "source": "/",
      "destination": "/index.html"
    },
    {
      "source": "/*/",
      "destination": "/index.html"
    }
  
  ],
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
```
6. Deploy your server by running `firebase deploy`.