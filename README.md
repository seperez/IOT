# ProCusto

> ProCusto is a measuring station that collects data from noise and temperature to consolidate them in one central location for analysis. Additionally it has the ability to trigger alerts to exceed defined limits.

## Installation
### Platform & tools

You need to install Node.js and then the development tools. Node.js comes with a package manager called [npm](http://npmjs.org) for installing NodeJS applications and libraries.
* [Install node.js](http://nodejs.org/download/) (requires node.js version >= 0.8.4)
* Install Grunt-CLI and Karma as global npm modules:

```
npm install -g grunt-cli karma bower
```
*  Also, you need to install mongoDB.

(Note that you may need to uninstall grunt 0.3 globally before installing grunt-cli)


### Get the Code

Choose a folder and do the following:

```
git clone https://github.com/seperez/procusto.git
cd procusto
```

### Scaffolding

Within the project folder you will find two other folders:

App: contains the mean.js scaffolding for a mean project.
Arduino: contains the program for the arduino devices both as clients and server.

### Installing dependencies

Once you have the code in your pc, you got to install the dependencies:
 	
```
cd App
npm install
```

## Running
### Start the Server

To run the application just do the following:
	
```
cd App
grunt
```
The application runs on port 3000, then to navigate the site enters 
	
```
http:localhost:3000
```

## Running Client Test
### Unit Test

```
cd App
grunt test
```

## Build the client app
The app made up of a number of javascript, css and html files that need to be merged into a final distribution for running (/public/dist).  We use the Grunt default tool to do this.

* Build client application:

```
cd App
grunt build    
```