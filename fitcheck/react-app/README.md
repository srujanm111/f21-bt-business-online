# fitcheck react-app

## Development & Testing Locally

-   First navigate to this folder `fitcheck/react-app` in terminal
-   Install dependencies with `npm install` or `npm i`
-   Start the app with `npm start`
    -   This will start the react development server
-   Build the app into static files for production mode with `npm run build`
    -   This will take a while, static files will be generated and placed into `fitcheck/react-app/build`
    -   These files can then be served by any web server
        -   For example, run `npm install --save-dev serve` (or `npm install -g serve`) and then `serve -s build` to try out production mode (for production mode, the backend will probably need to be running as well, for the app to work properly)
