# Job Application Tracker

This is a web application built to help users track their job applications. Users can add, view, edit, and delete job applications, as well as filter and search through their job history.

## Features

- **Add Job:** Users can add a new job application with details like job ID, title, company, job type, application date, source, and more.
- **View Jobs:** Users can view a list of all their job applications, sorted by date.
- **Edit Job:** Users can edit existing job applications to update their details.
- **Delete Job:** Users can delete job applications they no longer need.
- **Search:** Users can search for specific job applications by title, company, or any other relevant keyword.
- **Filter:** Users can filter job applications by their status, such as `Applied`, `OA Received`, `Tech Interview`, or `Rejected`.


## Installation

1. Clone the repository: `git clone https://github.com/ymakwan1/job-application-tracker.git`
2. Navigate to the project directory: `cd job-application-tracker`
3. Start Docker Desktop if it's not already running:
    ```
    make start-docker
    ```
4. Use the following commands to manage the project:

- **Build the Docker containers:**
    ```
    make build
    ```
- **Start the Docker containers in detached mode:**
    ```
    make up
    ```
- **Stop the Docker containers:**
    ```
    make down
    ```
- **Restart the Docker containers:**
    ```
    make restart
    ```
- **View logs of all Docker containers:**
    ```
    make logs
    ```
- **View the status of all Docker containers:**
    ```
    make ps
    ```
- **Stop all Docker containers:**
    ```
    make stop
    ```

5. Once the containers are up and running, open a web browser and navigate to `http://localhost:8080` to access the Job Application Tracker web application.


## Technologies Used

- React: Frontend JavaScript library for building user interfaces.
- Material-UI: React component library for styling and UI components.
- Flask: Backend web application framework for Python.
- PostgreSQL: SQL database for storing job application data.
- Docker: Containerization platform for deploying applications.

## Contributing

Contributions are welcome! Please follow the [Contributing Guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Material-UI](https://mui.com/): React component library for styling and UI components.
- [React Router](https://reactrouter.com/): Declarative routing for React applications.
- [Flask](https://flask.palletsprojects.com/en/3.0.x/): Web application framework for Python..
- [PostgresSQL](https://www.postgresql.org/): SQL database for storing job application data.
- [Docker](https://www.docker.com/): Containerization platform for deploying applications.