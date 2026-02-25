# Docker And Docker Compose Wizard

## Application Description
This project is a wizard that helps you to create a docker and docker compose file for your project.

## Tech Stack
- Vite
- Node.js
- JavaScript
- HTML
- CSS
- GitHub Actions
- Jest

## Project Configuration
- Use the latest stable version of Node.js
- Use Node.js modules instead of CommonJS
- Use the latest stable version of Vite
- Use the latest stable version of Jest
- Create a Vite Vanilla JavaScript project
- Create a GitHub Actions workflow for building and pushing to GitHub Pages on gh-pages branch
- The project will be a static website

## Project Structure
- src
    - assets
        - styles.css
    - components
        - services.js
        - other-component.js
    - main.js
    - index.html
- .github
    - workflows
        - gh-pages.yml
- .gitignore
- package.json
- README.md

## References
- Dockerfile: https://docs.docker.com/reference/dockerfile/
- Docker Compose: https://docs.docker.com/reference/compose-file/

## Best Practices & Style Guide
Here are the best practices and the style guide information.

### General Code Rules
- Create easier to test code
- Use camelCase for variable and function names
- Use snake_case for constants
- Use descriptive variable and function names
- Use native fetch API instead of axios any external libraries
- Use native API instead of any external libraries

### JavaScript Best Practices
- Use functional approach
- Use pure functions
- Use arrow functions instead of function expressions
- Use const for variables that don't change
- Use let for variables that change
- Use template literals instead of string concatenation
- Use object and array destructuring
- Use spread operator
- Use rest parameters
- Use async/await instead of promises
- Use modules instead of scripts
- Use camelCase for variable and function names
- Use snake_case for constants
- Use descriptive variable and function names
- Use native fetch API instead of axios any external libraries
- Use native API instead of any external libraries
- Use querySelector instead of getElementById
- Use querySelectorAll instead of getElementsByClassName
- Use event delegation
- Use event.preventDefault() instead of return false

### CSS Best Practices
- Use CSS variables
- Use mobile first approach
- Use CSS modules
- Use hyphenated naming for CSS classes
- Use descriptive CSS class names
- Use CSS variables for colors, fonts, and other styles
- Avoid using !important

### HTML Best Practices
- Use semantic HTML
- Avoid ID selectors
- Avoid inline styles

### Testing Best Practices
- Use Jest for testing
- Use describe and it blocks to group tests
- Use beforeEach and afterEach to set up and clean up test data
- Use toBe and toEqual for simple value checks
- Use toHaveBeenCalled and toHaveBeenCalledWith for function calls
- Use toThrow for error checking

### GitHub Actions Best Practices
- Use GitHub Actions for CI/CD
- Use GitHub Pages for hosting
- Use GitHub Actions for building and pushing to GitHub Pages on gh-pages branch

### Functionality
- Create a function to get the Supported tags from from Docker Hub without need to authenticate for a image

## Step 01
- Create the vite project

## Step 02
- Create the GitHub Actions workflow

## Step 03
- Create the HTML interface
- Create the CSS styles
- No logic in this step
- Use the General Code Rules in this file in any other missing
- Use the HTML Best Pratices in this file in any other missing
- Use the CSS Best Pratices in this file in any other missing

## Step 04
- Create the interface JavaScript logic
    - Move between steps using Next and Previous buttons
    - Move between steps clicking on the step card

