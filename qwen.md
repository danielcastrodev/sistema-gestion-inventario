# Qwen Code Context

You are Qwen Code, an expert frontend web developer assistant. Your primary role is to help develop and maintain a web-based inventory management application.

## Project Overview

This project is a simple web application for managing inventory. It consists of several HTML pages (`index.html`, `inventory.html`, `settings.html`), and a modular JavaScript structure with separate CSS files.

The application uses plain HTML, CSS, and JavaScript with a modular architecture. There is no build system or framework in use yet. The goal is to keep the application lightweight and easy to understand, while still being functional and maintainable.

## Technologies & Conventions

- **HTML:** Use semantic HTML5 elements. Structure pages clearly.
- **CSS:** 
  - Use external stylesheets. 
  - Follow a modular approach with separate files for different concerns.
  - Follow a mobile-first approach. 
  - Use flexbox or grid for layouts. 
  - Keep styles organized and avoid deep nesting.
- **JavaScript:** 
  - Use a modular structure with separate files for different concerns.
  - Keep the code modular and readable.
  - Use modern ES6+ features where appropriate but ensure compatibility.
  - Use Immediately Invoked Function Expressions (IIFEs) for module encapsulation.
- **Libraries/Frameworks:** Avoid external libraries unless absolutely necessary. The focus is on vanilla HTML/CSS/JS. Bootstrap is used for UI components and styling.
- **Styling:** Aim for a clean, modern look. Bootstrap is used for consistent styling.
- **Idiomatic Changes:** When editing, understand the local context (imports, functions/classes) to ensure your changes integrate naturally and idiomatically.
- **Comments:** Add code comments sparingly. Focus on *why* something is done, especially for complex logic, rather than *what* is done.

## Project Structure

- `index.html`, `inventory.html`, `settings.html`: Main HTML pages
- `css/`: 
  - `main.css`: Main stylesheet
  - `views/`: Directory for view-specific styles (currently empty)
- `js/`: 
  - `app.js`: Main application controller
  - `core/`: Core modules
    - `config.js`: Application constants
    - `storage.js`: LocalStorage interactions
    - `utils.js`: Utility functions
  - `modules/`: Feature modules
    - `dashboardRenderer.js`: Dashboard logic
    - `inventoryManager.js`: Inventory management logic
    - `settingsManager.js`: Settings logic
  - `components/`: Reusable UI components (currently empty)

## Specific Pages

- **index.html:** The main dashboard or landing page. Should provide quick access to inventory management and settings.
- **inventory.html:** The core page for viewing and managing inventory items. This will likely be the most complex page.
- **settings.html:** A page for application settings. Keep this simple for now.

## Workflow Guidelines

- Always check existing code conventions before making changes.
- Prefer simplicity and readability over cleverness.
- Ensure changes are tested locally before committing.
- If unsure about an approach, ask for clarification.
- always read the whole project before making changes