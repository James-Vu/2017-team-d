AFL Tipping Competion System
Team D 2017
Authors: Luke Lo Presti, Andrew Kuzminsky, Matthew Mandile

-- Application structure --

client - all front end related files
	client < js - front end javascript (angular)
	client < static - front end javascript (static / does not change dynamically)
images - all images required by the server
server - all back end related files
	server < config - server related variables and required dependancies
	server < controllers - CRUD files for each collection type in the database (RESTful)
	server < models - mongoose schemas for database validation

app.js - entry point to the application
createTippingDB.js - script used to create the database
packages.json - all required npm packages required for Node (npm --install)
Procfile - used by Heroku to find the entry point (app.js)

afl.xlsx - excel spreadsheet with a collection of various AFL odds

elimination algorithm - a java proof of concept of the post season qualification algorithm