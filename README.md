[![Stories in Ready](https://badge.waffle.io/IEEECS-VIT/RPL.png?label=ready&title=Ready)](https://waffle.io/IEEECS-VIT/RPL)
Riviera Premier League
=======================

The Riviera Premier League code repository

This website is hosted [here](http://www.rpl.ieeecsvit.com)

Please report any bugs or issues [here](https://github.com/IEEECS-VIT/RPL/issues)

#### Instructions for Installation:
###### Install the latest version of Node.js from [here] (https://nodejs.org/en/download)
###### Install the latest version of MongoDB from [here] (https://www.mongodb.org/downloads#production)
###### Install all dependencies

    $ npm install --silent

###### Install security dependency manually (Microsoft Windows only)

    # npm install bcryptjs

###### Create a file .env in the main project directory, and add the process environment variables to it. For instance:

      DAY=value
      LIVE=value
      MATCH=value
      KEY=value
      FACEBOOK_ID=value
      FACEBOOK_KEY=value
      TWITTER_ID=value
      TWITTER_KEY=value
      GOOGLE_ID=value
      GOOGLE_KEY=value
      MONGO=mongodb://127.0.0.1:27017/RPL

###### Run the server locally at port 3000 or "PORT" in process.env

    $ npm start

#### External Requirements:
* A MongoDB instance running locally or valid "MONGOLAB_URI"/"MONGOHQ_URI" string in process.env
* A valid collection of social authentication tokens in process.env (Facebook, Twitter, and Google)
* A valid "COOKIE_SECRET" string in process.env for better security (Optional)
* A valid "LOGENTRIES_TOKEN" in process.env for Logentries support (Optional)
* A valid "NEWRELIC_APP_NAME" and "NEWRELIC_LICENSE" in process.env for New Relic support (Optional)

PS: Configure a file watcher to incorporate auto-minification of public .css and .js files.
