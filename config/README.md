# EMPLOYEES REGISTER

> This app alows us to manage orders and retrieve results from the database using relationships.

In this version was implemented the API's backend  and  and the views from where will you get the data in JSON format

## STACK

>   ubuntu 18.04

>   "bcrypt": "^5.0.1",
>    "express": "^4.17.1",
>    "express-session": "^1.17.2",
>    "mongoose": "^5.12.11",
>    "mongoose-paginate-v2": "^1.3.18",
>    "passport": "^0.4.1",
>    "passport-local": "^1.0.0",
>    "pug": "^3.0.2"

## comands used 

> npm install express --save
> pm install express-session
> npm install mongoose
> npm install mongoose-paginate-v2
> npm install passport
> npm install passport-local
> npm install pug

## Initialice App
> clone repository: https://github.com/ch-canaza/employees_registration.git
> **$** cd employees_registration
> **employees_registration** sudo systemctl start mongod
> **employees_registration** node app.js
> http://localhost:3000/


## content

**SIGNUP** here you can register an user  filling some fields as: (nae, email, username, password), who is able to list employees.

**login:** here you send username and password in order to get in the applications and keep working with the other endpoints 

**Home** - here you get a list of registered employees, also you find some fields to customize search(not finished at all). 

**Add Employee** - Form where you can put info about employee and its contract terms.



## to do:

> Processing JSON responses with Reactjs in the front end
> to finalize filtering functionality, to get results with custom queries
> Finding pagination bug

