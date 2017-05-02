# About #

This project helps you to begin with your own ionic project. **The idea is to keep it constantly updated** not only with the latest ionic features but also with the latest best practices on the hybrid mobile development. This project has the following features:

* e2e tests with **protractor**
* a build system for production and development with **gulp**
* navbar, menus, buttons and content based on the ionic structure
* the facebook plugin running smothly on iOS and Andorid with **ngCordova**
* a fallback for the facebook plugin that makes possible for it to run in the desktop web browser

# Installation #

## 1) Install and Configure Android and iOS SDK ##

Android SDK: https://cordova.apache.org/docs/en/3.0.0/guide_platforms_android_index.md.html#Android%20Platform%20Guide
iOS SDK: https://cordova.apache.org/docs/en/3.0.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide


## 2) Install Cordova and Ionic ##

```
npm install -g cordova@4.3.0
npm install -g ionic@1.3.14
```

## 3) Install Global Dependencies ##

```
npm install -g gulp
npm install -g foreman
```

## 4) Install the Project ###

```
git clone git@github.com:vasconcelloslf/ionic-starter-app.git
cd ionic-starter-app
npm install
```

## 5) Add the Android and iOS platforms ##

```
ionic platform add android
ionic platform add ios
```

## 6) Install the plugins ##

### Basic Plugin Installation ###

There is a file ```hooks/after_platform_add/010_install_plugin```. The plugins will be installed after each ```ionic platform add``` command.

### Facebook Plugin Installation ###

The facebook plugin needs to be manually installed since it needs the **APP_ID** and the **APP_NAME** of your facebook app.

```
cordova -d plugin add https://github.com/Wizcorp/phonegap-facebook-plugin.git --variable APP_ID="your-fb-app-id" --variable APP_NAME="your-fb-app-name"
```

## 7) Configure the env variables (Foreman) ##

Inside the **root dir** create a file called **.env** with those variables below. Those variables are going to be used only inside a node process that is runned with **Foreman**. The e2e tests, for example, will need these configurations:

```
FB_EMAIL=your-fb-email (for the e2e tests)
FB_PASS=your-fb-pass   (for the e2e tests)

SELENIUM_ADDRESS=selenium-server-address (optional)
```

## 8) Configure the constant values (Gulp) ##

It is possible to use constants of the format **@@variableName** on the JS files. When running ```ionic serve``` or ``ionic build``` these onstants will be replaced with the values defined on **config/development.json** dir and **config/production.json** dir, respectively.

Inside the **config dir** create a file called **development.json** and another called **production.json** with the structure defined bbelow:

```
{
  "fbAppKey": "your-fb-app-key",
  "fbVersion": "v2.0"
}
```

# Development Workflow #

You should develop using the same ```www/index.html```, ```www/js/*``` and ```www/css/*``` files that you are used to. You can also develop using either CSS or SASS. The SASS files will be automatically preprocessed.

The before mentioned html, js and css files will not be served though. The served files will be the ```www/dist/*``` files. Those files are the result of the asset pipeline feature. Also, when you create a new file, it is important register it to be served in the ```www/assets.json``` file. Not that in this file the order do matter!

This project have an asset pipeline created with **Gulp**, both for development and for production. The css/js/fonts/image files that will be served by the browser by the app are the result of this pipeline. Those files live inside the ```www/dist``` dir.

When you run ```ionic serve``` the ```gulp dev:pipeline``` command will be executed. This pipeline will do the following:

- preprocess .scss files into .css
- replace strings matching the **@@stringName** format with the values defined on config/development.json
- inject the .css and .js files into the ```www/dist/index.html``` accordingly to the assets defined in the ```www/assets.json``` file, and in the same order.

When you run ```ionic build android/ios``` the ```gulp prod:pipeline``` will be executed. This pipeline will do the following:

- preprocess .scss files into .css
- concat the .css files into one application.css file
- minify the application.css file in order to gain a better performance
- replace strings matching the **@@stringName** format with the values defined on config/development.json
- inject the .css and .js files into the ```www/dist/index.html``` accordingly to the assets defined in the ```www/assets.json``` file, and in the same order.

The output files for both pipelines goes to the ```www/dist``` dir. This dir is not on the repository and shouldn't be added to it, because it works just like the ```www/platforms``` dir, that is, it only gets the output from the source files inside the ```www``` folder.

# E2E Tests #

## Install Protractor ##

```
npm install -g protractor

webdriver-manager update
webdriver-manager start
```

## Run the Server ##

```
ionic serve
```

## Run Protractor ##

Run with **Foreman** so the .env variables (with the fb credentials) can be loaded.

```
nf run protractor www/spec/protractor.config.js
```

## Author

[twitter.com/lfv89](http://twitter.com/lfv89)

[luisvasconcellos.com](http://www.luisvasconcellos.com)

Feel free to talk to me about anything related to this project.
