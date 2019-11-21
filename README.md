# moodzaic

## Milestone 4.a Submission

### A brief description about what you plan to implement in the 2nd iteration. Please refer back to your original design document to explain what you plan to accomplish, what are the changes, and particularly, what you do *not* plan to accomplish, if any.

Our first priority for this iteration is to make sure we have completely functional implementation of the features we hoped to include in the first iteration. This includes successfully logging in and out, including profile information on the profile page, editing personal profile information, fully functioning reminders, inputting daily observations, posting and commenting in communities, creating communities, and joining communities. 

New features we also plan to implement in this iteration include inputting goals, integrating reminders and mood prediction with ml, and visualizing mood history on profile.

We no longer plan to implement moderation of communities, and we have decided to keep reminders to the profile page instead of in a “virtual pet” form.

### A brief description about how the work will be divided among all pairs of people in your team.

Molly and Daniel are working on the frontend (React), with Molly focusing on community-related pages and Daniel focusing on user-related pages. 

In order to streamline the integration process, we now have Jersey, Marco, and Emil focusing entirely on integration between the frontend and the backend, handling API calls between Django and React.

Chema, Hunter and Zipporah are working on the backend, with Chema and Hunter focusing on ml and user/profile related implementation and integration, and Zipporah working on community/posting related functionality.


## Usage Instructions

### Initial Setup

Clone https://github.com/reyesj5/moodzaic

Cd into `/moodzaic`

Run `python3 -m venv env`

Run `source env/bin/activate`

Run `pip install -r requirements.txt`

Cd into `/moodzaic/moodaic_django`

Run `python3 manage.py makemigrations`

Run `python3 manage.py migrate`

Cd into `/moodzaic/moodzaic_django/frontend`

Run `npm install`

Run `npm install node.js`

### Running app

Cd into `/moodzaic`

Run `source env/bin/activate`

Cd into `/moodzaic/moodzaic_django/frontend`

Run `npm run start`

In a new window, cd into `/moodzaic/`

Run `source env/bin/activate`

Cd into `/moodzaic/moodaic_django`

Run `python3 manage.py runserver`

It will possibly fail, so run  `python3 manage.py runserver` again until it works

### Back-End/Integration Testing

Cd into `/moodzaic`

Run `source env/bin/activate`

Cd into `/moodzaic/moodzaic_django`

Run `python3 manage.py makemigrations`

Run `python3 manage.py migrate`

Run ‘python3 manage.py test’

## Front-End Testing

Cd into ‘/moodzaic/moodzaic_django/frontend’

With yarn installed, run "$yarn start" to launch the React App (at http://localhost:3000/) in a browser, and "$yarn test" to run the included test suites.

## Navigation

With both the Django and React servers activated:

Go to http://localhost:8000/ to see the login screen. This is the Django server’s page, which forwards content from the React app. NOTE: This will make it appear like there are two versions of the app, but having http://localhost:3000/ running is equivalent to Django reading from a set of static (html/css/javascript) files, except allowing for frontend changes to take effect immediately!

(The navigation process will be updated in iteration 2. Stay tuned!)

Go to http://localhost:8000/api/users/ to add a user, then click Post to submit

Return to http://localhost:8000/ and login with the credentials you just created

Enjoy the Profile page, and feel free to click the Record Mood link to see the Record Mood page

For the community aspect, go to http://localhost:8000/api/community/fitness to see an example of a functioning community. Try another query parameter (e.g. http://localhost:8000/api/community/crerar) to see the API handle a call to a nonexistent community. 

## Summary Workflow

### Add Basic URLs and Views
Map your Project’s `urls.py` file to the new app.
In your App directory, create a urls.py file to define your App’s URLs.
Add views, associated with the URLs, in your App’s `views.py`; make sure they return a HttpResponse object. Depending on the situation, you may also need to query the model (database) to get the required data back requested by the end user.

### Models and Databases
Update the database engine to `settings.py` (if necessary, as it defaults to SQLite).
Create and apply a new migration.
Create a super user.
Add an `admin.py` file in each App that you want access to in the Admin.
Create your models for each App.
Create and apply a new migration. (Do this whenever you make any change to a model).


