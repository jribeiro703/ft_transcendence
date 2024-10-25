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
	zsh \
	curl \
	&& rm -rf /var/lib/apt/lists/*

# Copy the requirements file
COPY ./docker/django/requirements.txt /tmp/requirements.txt

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r /tmp/requirements.txt

# Expose the port the app runs on
EXPOSE 8000

# Install Oh My Zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Install Zsh plugins
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions \
	&& git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# Copy the .zshrc file
COPY ./docker/django/zshrc /root/.zshrc

# Set Zsh as the default shell for the root user
RUN chsh -s /bin/zsh root

# Copy the requirements file
COPY ./docker/django/requirements.txt /tmp/requirements.txt

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r /tmp/requirements.txt

# Expose the port the app runs on
EXPOSE 8000

# Run the Django development server
CMD ["python", "srcs/backend/manage.py", "runserver", "0.0.0.0:8000"]
