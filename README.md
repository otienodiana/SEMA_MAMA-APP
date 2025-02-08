# SEMA_MAMA-APP

## Project Description
Sema Mama is a digital health platform that provides accessible, community-driven support for mothers experiencing postpartum depression in Nairobi, Kenya. Unlike existing solutions, Sema Mama offers multilingual, culturally sensitive SMS-based support, real-time emotional assistance through voice and video calls, and integration with local health workers to allow for sustained support of mental health.

## Problem it Solves
Sema Mama fills in the gaps through direct emotional support using voice and video calls so that mothers get to professionals and peers in need. Besides, it also provides multilingual, culturally relevant SMS-based mental health support that is easily accessible and free of cost, enabling guidance and assurance among women from low-resource areas. Working together with community-based health workers, Sema Mama facilitates further follow-up on mental health screening and interventions at household levels so that the mothers continue to get help. Consequently, Sema Mama ensures these postpartum mental health support systems are made accessible to every expectant mother, regardless of distance or status.

## GitHub Repository Link
[GitHub Repository](https://github.com/your-username/sema-mama-django)

## Prerequisites
Before you begin, ensure that you have the following installed:
- [Python](https://www.python.org/) (version 3.11.4)
- [pip](https://pip.pypa.io/) (Python package installer)
- [Django](https://www.djangoproject.com/) (version 4.2.7)
- PostgreSQL (for database management)

## Getting Started
1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/sema-mama-django.git
    cd sema-mama-django
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
    SECRET_KEY=your_secret_key
    DATABASE_URL=postgres://user:password@localhost:5432/sema_mama_db
    ```
    Replace `your_secret_key` with a secure secret key for Django.
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
- **Figma Mockups:** *(Provide link or screenshots of UI/UX designs)*
- **Screenshots of the App:** *(Include main interface screenshots here)*

## Deployment Plan (Using Docker)
The Sema Mama app will be deployed using Docker for containerization. Below are the steps for deployment:

### 1. Dockerize the Application
Create a `Dockerfile` in the root directory:
```dockerfile
# Use official Python image
FROM python:3.11

WORKDIR /app

# Copy project files
COPY . /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### 2. Create a `docker-compose.yml` File
```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
    env_file:
      - .env
  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: username
      POSTGRES_PASSWORD: password
      POSTGRES_DB: sema-mama-db
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

### 3. Build and Run Docker Containers
```bash
docker-compose up --build -d
```

### 4. Deploy to Cloud Provider (DigitalOcean)

#### Push Docker Image to Docker Hub:
```bash
docker login
docker tag sema-mama your-dockerhub-username/sema-mama
docker push your-dockerhub-username/sema-mama
```

#### Deploy on a Virtual Machine (DigitalOcean)
1. Install Docker on your cloud instance.
2. Pull the Docker image:
    ```bash
    docker pull your-dockerhub-username/sema-mama
    ```
3. Run the container:
    ```bash
    docker run -d -p 8000:8000 your-dockerhub-username/sema-mama
    ```

#### Set up Nginx as a Reverse Proxy:
1. Install Nginx:
    ```bash
    sudo apt update && sudo apt install nginx -y
    ```
2. Configure Nginx to forward requests to the Django app.

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
│── Dockerfile     # Docker configuration for containerization
│── docker-compose.yml  # Docker Compose file for multi-container setup
│── README.md      # Project documentation 
```


## Contributing
If you would like to contribute to SEMA-MAMA, please follow our [contribution guidelines](CONTRIBUTING.md).

## License
This project is licensed under the [MIT License](LICENSE).

