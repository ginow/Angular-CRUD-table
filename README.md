# Editable Angular grid

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.3.

## Features
For demo go to [Angular-CRUD-table](https://ginow.github.io/Angular-CRUD-table/)

For youtube video tutorial to integrate with D365 form go to [Integrating an editable Angular grid on D365 form](https://youtu.be/WYT3nDBcwpg)

This was buit with the help of [Angular Material](https://material.angular.io/).

### This table is supposed to do the following:
* Retrieve
* Create 
* Update
* Delete
* Filter
* Sort
* Pagination

## Notes
It retrieves data from webapi service by http get request. For developement purpose the data (stored as json) is retrieved locally from the "assets" folder. 

crm-webapi-service.service.ts is the service created in angular for webapi calls to Microsoft Dynamics 365 environment

Delete, Update, Create option will throw a console log message "Something bad has happened" but that is because service call isn't authorised. Still the selected rows to delete will be deleted in the browser. Refreshing the page will load the deleted data again.

Column names have been hard-coded, but can be generalised.

index.html, main.js, polyfills.js, runtime.js, styles.js, assets has also been copied to the root location so that the [demo](https://ginow.github.io/Angular-CRUD-table/)
 page works.
 
Before publishing the index.html webresource in crm system the below base href location needs to be changed to your organisations url
<base href="https://i20elite.crm8.dynamics.com//WebResources/"> 
Also each of the js files should be prefixed with the publisher's style, eg. "main.js" as "new_main.js"

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
