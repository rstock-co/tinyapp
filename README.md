# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Extra Features

- Error handling is more standardized and displays errors in a card with buttons (see below):
![Error Card](https://github.com/rstock-co/tinyapp/blob/main/docs/error.png)
  
- Routes and source data have been separated into modules vs staying in the main server file

- Added analytics to track total and unique visits for each URL (stretch goal)

## Final Product

### MyURLs Page
- Displays all of the user's saved URL's

![My URLs Page](https://github.com/rstock-co/tinyapp/blob/main/docs/urls-page.png)

### Edit URLs Page
- Edit any URL and click on short URL to redirect to website
  
![Edit URLs](https://github.com/rstock-co/tinyapp/blob/main/docs/edit-url.png)

### Registration Page
- Register to create private collection of short URL's

![Register](https://github.com/rstock-co/tinyapp/blob/main/docs/register.png)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command.
