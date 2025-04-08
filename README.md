# SEMA_MAMA-APP

## Project Description
Sema Mama is a digital health platform that provides accessible, community-driven support for mothers experiencing postpartum depression in Kenya. Unlike existing solutions, Sema Mama offers multilingual, culturally sensitive SMS-based support, real-time emotional assistance (in future) through  integration with local health workers to allow for sustained support of mental health.

## Problem it Solves
Sema Mama fills in the gaps through direct emotional support using virtual appointments and forum discussions  so that mothers get to professionals and peers in need. It also provides multilingual, culturally relevant SMS-based mental health support that is easily accessible and free of cost, enabling guidance and assurance among women from different areas. Working together with community-based health workers, Sema Mama facilitates further follow-up on mental health screening and interventions at household levels so that the mothers continue to get help. Consequently, Sema Mama ensures these postpartum mental health support systems are made accessible to every expectant mother, regardless of distance or status.

## GitHub Repository Link
[GitHub Repository](https://github.com/otienodiana/SEMA_MAMA-APP.git)

## Prerequisites
Before you begin, ensure you have the following installed:

### Backend Requirements
- [Python](https://www.python.org/) (version 3.11.4)
- [pip](https://pip.pypa.io/) (Python package installer)
- [Django](https://www.djangoproject.com/) (version 4.2.7)
- [MySQL](https://dev.mysql.com/downloads/installer/) (version 8.0 or higher)
- [Git](https://git-scm.com/downloads) (version 2.x or higher)

### Frontend Requirements  
- [Node.js](https://nodejs.org/) (version 16.x or higher)
- [npm](https://www.npmjs.com/) (version 8.x or higher)
- [React](https://reactjs.org/) (version 18.x)

### Optional Tools
- [VS Code](https://code.visualstudio.com/) (recommended IDE)
- [MySQL Workbench](https://www.mysql.com/products/workbench/) (for database management)
- [Postman](https://www.postman.com/) (for API testing)

## Getting Started

### Backend Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/otienodiana/SEMA_MAMA-APP.git
    cd SEMA_MAMA-APP
    ```

2. **Set up MySQL Database:**
    ```sql
    CREATE DATABASE sema_mama_db;
    CREATE USER 'Diana'@'localhost' IDENTIFIED BY 'Dee0000!';
    GRANT ALL PRIVILEGES ON sema_mama_db.* TO 'Diana'@'localhost';
    FLUSH PRIVILEGES;
    ```

3. **Create and activate virtual environment:**
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # Linux/Mac
    python3 -m venv venv
    source venv/bin/activate
    ```

4. **Install backend dependencies:**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

5. **Configure environment:**
    Create `.env` file in backend directory:
    ```plaintext
    DEBUG=True
    SECRET_KEY=your_secret_key_here
    DATABASE_NAME=sema_mama_db
    DATABASE_USER=Diana
    DATABASE_PASSWORD=Dee0000!
    DATABASE_HOST=localhost
    DATABASE_PORT=3306
    ALLOWED_HOSTS=127.0.0.1,localhost,172.17.146.93
    
    # Additional settings
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USE_TLS=True
    EMAIL_HOST_USER=your-email@gmail.com
    EMAIL_HOST_PASSWORD=your-app-specific-password
    ```

6. **Apply database migrations:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

7. **Create superuser account:**
    ```bash
    python manage.py createsuperuser
    ```

8. **Run backend server:**
    ```bash
    python manage.py runserver
    ```

### Frontend Setup

1. **Install frontend dependencies:**
    ```bash
    cd frontend/sema-react-app
    npm install
    ```

2. **Configure frontend environment:**
    Create `.env` file in frontend directory:
    ```plaintext
    REACT_APP_API_URL=http://localhost:8000/api
    REACT_APP_DEBUG=true
    ```

3. **Run frontend development server:**
    ```bash
    npm start
    ```
    The app will be accessible at `http://localhost:3000`

## Usage
- Visit `http://127.0.0.1:8000` in your web browser to access the SEMA-MAMA Django app.

## Designs
- **Figma Mockups:** [View UI/UX Designs](https://www.figma.com/proto/dnECuP1wGtoMQXviV5sMqd/Desktop-Designs-%3A-Healthcare-Consultation-(Community)?node-id=32-2&p=f&t=A9wLhlGXN3Q54tWz-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=32%3A2)

## Deployment Plan
The frontend of Sema Mama is deployed on **Vercel**, the backend is deployed on **Render**, and the MySQL database is hosted on **Google Cloud**.

### Deploying the Frontend
1. Ensure your frontend project is pushed to GitHub.
2. Log in to [Vercel](https://vercel.com/) and create a new project.
3. Select the frontend repository and deploy.
4. Configure environment variables in Vercel.
5. Get the deployed URL and update API endpoints in the frontend code.

### Deploying the Backend
1. Push the backend code to GitHub.
2. Log in to [Render](https://render.com/) and create a new web service.
3. Select the backend repository and configure the following:
    - Start Command: `gunicorn sema_mama.wsgi:application --bind 0.0.0.0:8000`
    - Environment Variables: Use values from your `.env` file.
4. Deploy and note the backend service URL.

### Deploying MySQL Database
1. Log in to [Google Cloud](https://cloud.google.com/) and create a new MySQL instance.
2. Configure the database with:
    - Database Name: `sema_mama_db`
    - User: `Diana`
    - Password: `Dee0000!`
3. Update `DATABASE_HOST` in `.env` with the Google Cloud MySQL instance connection string.

### Connecting Services
- Ensure the frontend interacts correctly with the backend by updating API URLs in the frontend code.
- Update the backend to use the correct database credentials from Google Cloud.

## Development

### Backend Development

- **Run tests:**
    ```bash
    python manage.py test
    ```

- **Create new app:**
    ```bash
    python manage.py startapp appname
    ```

- **Generate database migrations:**
    ```bash
    python manage.py makemigrations appname
    ```

- **Check migration status:**
    ```bash
    python manage.py showmigrations
    ```

### Frontend Development

- **Run tests:**
    ```bash
    npm test
    ```

- **Build for production:**
    ```bash
    npm run build
    ```

- **Run linter:**
    ```bash
    npm run lint
    ```

### API Documentation
After running the backend server, access the API documentation:
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`

### Common Issues & Solutions

1. **Database Connection Issues:**
   - Verify MySQL service is running
   - Check credentials in .env file
   - Ensure MySQL user has correct privileges

2. **Node Module Issues:**
   - Delete node_modules and package-lock.json
   - Run `npm install` again
   
3. **Python Dependencies:**
   - Update pip: `python -m pip install --upgrade pip`
   - If installation fails, try: `pip install -r requirements.txt --no-cache-dir`

## Project Folder Structure
```
/sema-mama-django
│── /frontend      # Frontend code (HTML, CSS, JS, React if applicable)
│── /backend       # Backend code (Django framework, API, database models)
│── /docs          # UML diagrams, wireframes, schema diagrams
│── /scripts       # Deployment or setup scripts
│── requirements.txt  # Project dependencies
│── .env           # Environment variables
│── manage.py      # Django project management script
│── README.md      # Project documentation
```

## Contributing
If you would like to contribute to SEMA-MAMA, please follow our [contribution guidelines](CONTRIBUTING.md).

## License
This project is licensed under the [MIT License](LICENSE).

