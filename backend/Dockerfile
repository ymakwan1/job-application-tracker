# Use the official Python image as a base image
FROM python:3.11

# Set the working directory in the container
WORKDIR /app

# Copy the local code to the container
COPY . .

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt  # If you have a requirements.txt file

# Command to run your application with Gunicorn
CMD ["gunicorn", "--workers", "1", "--bind", "0.0.0.0:5000", "app:app"]
