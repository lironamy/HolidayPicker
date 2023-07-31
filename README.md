# Vacation Management App

![Holiday Picker App](https://example.com/path/to/image.png)

 Holiday Picker App is a full-stack web application built with React, Node.js, and SQL. It provides a comprehensive solution for vacation administration and exploration, allowing administrators to manage vacations and users to follow their favorite travel opportunities. With an interactive UI, pagination, and secure authentication, this app ensures a seamless and delightful experience for all users.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## Features

- **Admin Dashboard**: Administrators have access to a dedicated dashboard to efficiently manage vacations. They can add new vacations, edit existing ones, and remove outdated vacations with ease.

- **Interactive Follow System**: Registered users can follow their preferred vacations, receiving timely updates and staying informed about exciting travel opportunities.

- **Pagination**: The vacation list is paginated to ensure smooth browsing and prevent overwhelming users. Pagination enables seamless navigation across multiple vacations.

- **Detailed Vacation Cards**: Each vacation is showcased on a visually appealing card with an image, title, description, price, start and end dates, follower count, and interactive icons for following/unfollowing and editing/deleting.

- **Secure Authentication**: User authentication is implemented using JWT (JSON Web Tokens), providing a secure login system for users and administrators.

- **Responsive Design**: The app is fully responsive, offering consistent performance across various devices and screen sizes.

## Technologies

- Front-End: React, React Router, Axios, React Icons
- Back-End: Node.js, Express, JWT (JSON Web Tokens)
- Database: SQL (MySQL, PostgreSQL, etc.)
- Package Manager: npm
- Deployment: (Optional) Heroku, Netlify, or other platforms

## Installation

 Clone the repository:

 git clone https://github.com/lironamy/HolidayPicker.git

- cd Backend 
- Install the dependencies:
- npm install

- cd ..
-  cd frontend 
-  Install the dependencies:
-  npm install  

## Usage

Start the development server:
 
- npm run dev
- npm start

Start the development front:

- npm start

Open your web browser and go to http://localhost:3000 to access the Holiday Picker.

API Endpoints
GET /vacations: Get all vacations.
POST /vacations: Add a new vacation (requires admin authentication).
PUT /vacations/:vacationId: Edit a vacation (requires admin authentication).
DELETE /vacations/:vacationId: Delete a vacation (requires admin authentication).
POST /users/follow/:vacationId: Follow a vacation (requires user authentication).
POST /users/unfollow/:vacationId: Unfollow a vacation (requires user authentication).
POST /users/login: User login.
GET /users/profile: Get user profile (requires user authentication).

## Contributing

We welcome contributions to enhance Vacation Management App.
If you find any bugs or have ideas for improvements, 
feel free to open an issue or submit a pull request. 
Together, let's make travel planning and administration easier for everyone!







