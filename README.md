# moodzaic

## Milestone 4.b Submission
## Acceptance Tests
 
Click the link titled “sign up”.
Input username “joe” and password “foo”
Input name “Joe” “Shmoe”, age 10, gender “boy”, email “joe@mail.com”
On the profile page, this information should be shown.
Click the edit symbol to edit profile information. Change any information; any information not inputted will not change. Try to input invalid responses like an ill-formed email, which will produce an error in the logs.
Log out, and log back in with username “joe” and password “foo” (unless you changed the password).
Your updated information will be displayed on the profile.
Click on “Record Mood” in the menu.
Input numeric values into each field. Leaving inputs blank will result in an error message. Choose “Sad” as your mood.
Return to your profile. The reminders should read: “You are not alone”, “There is nothing wrong with getting help”... with the option to show more reminders. The three visualizations should show some reasonable defaults reflecting a user’s mood, daily habits, and goal progress.
Click on “My Communities”, then click on “All Communities”. Click “Create New Community”, and input name “My Community”.
Click on “My Moodzaic”, then navigate back to “My Communities”. There, you will find your new community.
Click on it to enter, and write a post.
Click on “My Moodzaic”, then navigate back to “My Community”. There, you will find your new post.
Log out, and create a new account. Navigate back to “All Communities”. There you will see “My Community”, greyed out because you are not yet part of it.
Log back in to joe and navigate to “My Community”.
Click reply, and type a reply to the post. Click submit to submit.
Click on “My Moodzaic”, then navigate back to “My Community”. There, you will find the reply.
 
## Text Description of Implementation
 
We have implemented the following use cases:
-signing up and creating a profile, including goals
-logging in and out
-viewing profile information on the profile page
-editing profile information
-inputting daily observations, to be used by the ml
-receiving reminders on the profile page, as outputted by the ml
-creating communities
-joining communities 
-posting and commenting in communities
-viewing mood history visualizations on profile page
 
## Work Division
 
Molly and Daniel worked on the frontend (React), with Molly focusing on community-related pages and Daniel focusing on user-related pages.
 
Jersey, Marco, and Emil focused on integration between the frontend and the backend, handling API calls between Django and React.
 
Chema, Hunter and Zipporah worked on the backend, with Chema and Hunter focusing on ml and user/profile related implementation and integration, and Zipporah working on community/posting related functionality.
 
However, in this iteration, we met several times with the larger group, and our work often overlapped between groups.
 
## Changes from Earlier Milestones
 
Added additional unit tests as requested in milestone 4a email (to check for negative inputs in ViewsCommunityTests, PostTestCase, test_setOriginalPost, test_createProfile, test_updateProfile, and test_postObervation.
 
On the front end, we added a unit test for UpdateProfile, which previously did not have its own file.
 
On the back end, we refactored the Goals and Moods in the User “app” to not be Model classes. They are now direct properties of other Model classes.
 
We have not made any design changes from what we said we would accomplish in milestone 4a. What we were not able to accomplish is described in the following section.
 
## Small Tasks to Finish by Milestone 5
* Error messages in Update Profile menu, specifically for negative ages or mismatched in puts in the Password and Verify Password sections.
* My Moodzaic page’s visualizations need to be based on actual user data
* Users need to be able to join communities besides on creation
 
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
 
Cd into `/moodzaic/moodaic_django`
 
Run `python3 manage.py makemigrations`
 
Run `python3 manage.py migrate`
 
Run ‘python3 manage.py test’
 
## Front-End Testing
 
Cd into ‘/moodzaic/user-interface/moodzaic’
 
With yarn installed, run "$yarn start" to launch the React App (at http://localhost:3000/) in a browser, and "$yarn test" to run the included test suites.
 
## Navigation
 
With both the Django and React servers activated:
 
Go to http://localhost:8000/ to see the login screen. This is the Django server’s page, which forwards content from the React app. This will make it appear like with have two versions of the app, but having http://localhost:3000/ allows the Django app to get the most current changes to the front end as soon as they are made, as opposed to compiling the React app into static files.
 
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
 




