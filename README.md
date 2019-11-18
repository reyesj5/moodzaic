# moodzaic

# For graders!

## Initial Setup

Clone https://github.com/reyesj5/moodzaic

Cd into /moodzaic

Run python3 -m venv env

Run source env/bin/activate

Run pip install -r requirements.txt

Cd into /moodzaic/moodaic_django

Run python3 manage.py makemigrations

Run python3 manage.py migrate

Cd into /moodzaic/moodzaic_django/frontend

Run npm install

Run npm install node.js

Run npm run start

In a new window, cd into /moodzaic/

Run source env/bin/activate

Cd into /moodzaic/moodaic_django

Run python3 manage.py runserver

It will possibly fail, so run  python3 manage.py runserver again until it works

## Navigation

Go to http://localhost:8000/ to see the login screen

Go to http://localhost:8000/api/users/ to add a user, then click Post to submit

Return to http://localhost:8000/ and login with the credentials you just created

Enjoy the Profile page, and feel free to click the Record Mood link to see the Record Mood page

For the community aspect, go to http://localhost:8000/api/community/fitness to see an example of a functioning community. Try another query parameter (e.g. http://localhost:8000/api/community/crerar) to see the API handle a call to a nonexistent community. 

# Summary Workflow
The following is a basic workflow that you can use as a quick reference for developing a Django Project.

## Django Setup
Within repo directory, create and activate a virtualenv.

`python3 -m venv path/env`

`(Linux/mac) source env/bin/activate`

`(windows) \env\Scripts\activate.bat`

Install Django and other dependencies.

`pip install -r requirements.txt`

(optional) Create your project:

`django-admin.py startproject <name>`

Create a new app (inside django project folder):

`python manage.py startapp <appname>`

Add your app to the `INSTALLED_APPS` tuple in project `setting.py`


## Add Basic URLs and Views
Map your Project’s `urls.py` file to the new app.
In your App directory, create a urls.py file to define your App’s URLs.
Add views, associated with the URLs, in your App’s `views.py`; make sure they return a HttpResponse object. Depending on the situation, you may also need to query the model (database) to get the required data back requested by the end user.

## Templates and Static Files
Create a templates and static directory within your project root.
Update settings.py to include the paths to your templates.
Add a template (HTML file) to the templates directory. Within that file, you can include the static file with - `{% load static %}` and `{% static "filename" %}`. Also, you may need to pass in data requested by the user.
Update the views.py file as necessary.

## Models and Databases
Update the database engine to `settings.py` (if necessary, as it defaults to SQLite).
Create and apply a new migration.
Create a super user.
Add an `admin.py` file in each App that you want access to in the Admin.
Create your models for each App.
Create and apply a new migration. (Do this whenever you make any change to a model).

## Forms
Create a forms.py file at the App to define form-related classes; define your ModelForm classes here.
Add or update a view for handling the form logic - e.g., displaying the form, saving the form data, alerting the user about validation errors, etc.
Add or update a template to display the form.
Add a urlpattern in the App’s `urls.py` file for the new view.

## User Registration
Create a UserForm
Add a view for creating a new user.
Add a template to display the form.
Add a urlpattern for the new view.

## User Login
Add a view for handling user credentials.
Create a template to display a login form.
Add a urlpattern for the new view.

## Setup the template structure
Find the common parts of each page (i.e., header, sidebar, footer).
Add these parts to a base template
Create specific. templates that inherent from the base template.

# Running Front-End Scripts

## Set-Up
In /user-interface/moodzaic, and with yarn installed, run "$yarn start" to launch the React App in a browser, and "$yarn test" to run the included test suites.
