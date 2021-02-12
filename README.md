# Roadie

### Live @ [roadie.netlify.app](https://roadie.netlify.app/)

**Roadie** is a web app that allows two different type of users to connect, an artist or a client, allowing them to directly communicate and contact one another to plan events and book gigs together. The purpose of this app is the remove the need of having a middle-man between the two types of users, which often negatively effects the industry when upcoming artists are trying to get their name out there.

Built with React, Redux, Bootstrap, FireBase, Google Cloud Storage, and PostgreSQL

![Roadie](./docs/images/screen1.png)
![Roadie](./docs/images/screen2.png)

## Features

Users are able to:

- Create a profile depending if they are an artist or client.
- Search for other users and filter by Artist, Client, or Genre.
- Edit their profile information.
- Upload pictures and videos to advertise/market themselves to other users.
- Clients can create/edit events.
- Users can contact each other by visiting each others profiles and clicking the "Book Me" or "Contact Me" buttons, depending if they are an artist or client.
- Artists can accept gigs or work after clients have asked to book them.

## Future Features

- Chat feature and/or video chat between Clients and Artists
- Integrating direct payments for the exchange of services between the two types of users
- Review/Feedback system for both Artists and Clients
- Adding venue locations
- Badges: an fun award system that help an artists' or clients' publicity (example: Crowd Favorite )

## Technical Milestones

- Implementing NoSQL with Firebase
- Recreating design from scratch and implementing Bootstrap for a more responsive application

## Technologies Used

- Node.js & Express.js. For the HTTP backend server.
- Firebase Authentication. For handling user authentication and authorization.
- React.js. For the front-end/client interface of our app.
- PostgreSQL. For our relation database management system.
- pg-promise. For interfacing with our database in our backend code.
- Bootstrap & CSS3. For our design and responsiveness for our app.
- Firebase. FOr handling our real-time notifications between the two types of users.

## Local Setup

You must have installed [Node.js](https://nodejs.org) as well as [PostgreSQL](https://www.postgresql.org/) in your computer.

You can check for these dependencies with `node -v` and `psql -v`. If your shell/terminal doesn't have a complaint and you see the version numbers you are good to go.

1.  Clone this repo and change the current directory to it:

    git clone https://github.com/kwong0419/roadie.git && cd roadie

2.  Install dependencies for the Node/Express Server (`backend` folder):

    cd backend && npm install

3.  Install dependencies the React App (`frontend` folder):

    cd frontend && npm install

4.  Create database and seed sample data while being in the `GameOn` directory with:

    psql -f ./backend/db/roadie_db.sql

    > [Make sure PostgreSQL is running!](https://www.google.com/search?q=make+sure+postgres+is+running&oq=make+sure+postf&aqs=chrome.1.69i57j0l5.5280j1j7&client=ubuntu&sourceid=chrome&ie=UTF-8)

5.  To launch the Node/Express server, inside the `backend` folder run:

        npm start

6.  To launch the React App, inside the `frontend` folder, and preferably in another terminal window run:

        npm start

7.  A new browser tab should have been opened and the App should be running.
