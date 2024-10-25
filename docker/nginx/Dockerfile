FROM nginx:latest

# Copy the Nginx configuration files
COPY conf.d /etc/nginx/conf.d

# Copy the SSL certificates
COPY certs /etc/nginx/certs

# Copy the .htpasswd file and set permissions
COPY conf.d/.htpasswd /etc/nginx/conf.d/.htpasswd
RUN chown nginx:nginx /etc/nginx/conf.d/.htpasswd && chmod 644 /etc/nginx/conf.d/.htpasswd