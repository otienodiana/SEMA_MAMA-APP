# SEMA_MAMA-APP

## Project Description
Sema Mama is a digital health platform that provides accessible, community-driven support for mothers experiencing postpartum depression in Nairobi, Kenya. Unlike existing solutions, Sema Mama offers multilingual, culturally sensitive SMS-based support, real-time emotional assistance through voice and video calls, and integration with local health workers to allow for sustained support of mental health.

## Problem it Solves
Sema Mama fills in the gaps through direct emotional support using voice and video calls so that mothers get to professionals and peers in need. It also provides multilingual, culturally relevant SMS-based mental health support that is easily accessible and free of cost, enabling guidance and assurance among women from low-resource areas. Working together with community-based health workers, Sema Mama facilitates further follow-up on mental health screening and interventions at household levels so that the mothers continue to get help. Consequently, Sema Mama ensures these postpartum mental health support systems are made accessible to every expectant mother, regardless of distance or status.

## GitHub Repository Link
[GitHub Repository](https://github.com/otienodiana/SEMA_MAMA-APP.git)

## Prerequisites
Before you begin, ensure that you have the following installed:
- [Python](https://www.python.org/) (version 3.11.4)
- [pip](https://pip.pypa.io/) (Python package installer)
- [Django](https://www.djangoproject.com/) (version 4.2.7)
- MySQL (for database management)
- Node.js (if working with the frontend)
- Git (for version control)
- WSL (if using Windows)

## Getting Started
1. **Clone the repository:**
    ```bash
    git clone https://github.com/otienodiana/SEMA_MAMA-APP.git
    ```
2. **Create a Virtual Environment:**
    ```bash
    python -m venv venv
    ```
3. **Activate the Virtual Environment:**
    - On Windows:
        ```bash
        .\venv\Scripts\activate
        ```
4. **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
5. **Configure Environment Variables:**
    Create a `.env` file in the root directory and add the following:
    ```plaintext
    DEBUG=True
    SECRET_KEY=your_secret_key_here
    DATABASE_NAME=sema_mama_db
    DATABASE_USER=Diana
    DATABASE_PASSWORD=Dee0000!
    DATABASE_HOST=localhost
    DATABASE_PORT=3306
    ALLOWED_HOSTS=127.0.0.1,localhost,172.17.146.93
    ```
6. **Apply Migrations:**
    ```bash
    python manage.py migrate
    ```
7. **Create Superuser (for Admin Access):**
    ```bash
    python manage.py createsuperuser
    ```
    Follow the prompts to create an admin user.
8. **Run the Development Server:**
    ```bash
    python manage.py runserver
    ```
    The app will be accessible at `http://127.0.0.1:8000`.
9. **Access the Admin Panel:**
    Visit `http://127.0.0.1:8000/admin` in your web browser and log in with the superuser credentials.

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

