# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set directory
WORKDIR /workspace

# Install system dependencies
RUN apt-get update && apt-get install -y \
	build-essential \
	libpq-dev \
	git \
	iproute2 \
	&& rm -rf /var/lib/apt/lists/*

# Copy the requirements file
COPY ./docker/django/requirements.txt /tmp/requirements.txt

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r /tmp/requirements.txt

# Expose the port the app runs on
EXPOSE 8000

# Run the Django development server
CMD ["python", "srcs/manage.py", "runserver", "0.0.0.0:8000"]
# CMD ["tail", "-f", "/dev/null"]
