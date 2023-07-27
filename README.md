Employee Tracker
The Employee Tracker is a command-line application built to help manage a company's employee database. It enables non-developers to easily view and interact with information stored in the database, acting as a basic content management system (CMS). The application is built using Node.js, Inquirer, and MySQL.

Table of Contents
User Story
Functionality
Installation
Usage
Walkthrough Video
Database Schema
Contributing
License
User Story
As a business owner, you want to be able to view and manage the departments, roles, and employees in your company. This organization and planning of your business is made possible with the Employee Tracker.

Functionality
The application fulfills the following functions:

View all departments, roles, and employees
Add a department, role, or an employee
Update an employee role
Installation
Clone the repository to your local machine.
Run npm install in your terminal/command line to install all necessary packages.
Run your MySQL server and create the database using the provided schema in the db folder.
Update the config/connection.js file with your MySQL server credentials.
Use the command node server.js in your terminal/command line to start the application.
Usage
The application is invoked using the command node server.js in the terminal/command line.

On invocation, you're presented with options to:

View all departments, roles, or employees
Add a department, role, or an employee
Update an employee role
Depending on your choice, you're guided through a series of prompts to gather necessary information.

Walkthrough Video
You can view a detailed walkthrough video of the application here:
https://drive.google.com/file/d/1zSD5cSB7mIz2M7N95E0JxPMQ-sbgC7SM/view


Database Schema
The database schema consists of three tables:

department: Contains id (INT PRIMARY KEY) and name (VARCHAR(30)).
role: Contains id (INT PRIMARY KEY), title (VARCHAR(30)), salary (DECIMAL), and department_id (INT).
employee: Contains id (INT PRIMARY KEY), first_name (VARCHAR(30)), last_name (VARCHAR(30)), role_id (INT), and manager_id (INT).
Contributing
Contributions are always welcome. Please see the contributing guidelines to know more.

Questions
If you have any questions or need further clarification, feel free to contact me.
