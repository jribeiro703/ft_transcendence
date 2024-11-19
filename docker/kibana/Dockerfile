FROM docker.elastic.co/kibana/kibana:7.10.1

COPY --chown=kibana:kibana ./docker/kibana/init_kibana.sh /usr/local/bin/init_kibana.sh
RUN chmod +x /usr/local/bin/init_kibana.sh
RUN mkdir -p /usr/share/kibana/config/certs/
COPY --chown=kibana:kibana ./docker/nginx/certs/localhost.key /usr/share/kibana/config/certs/localhost.key
COPY --chown=kibana:kibana ./docker/nginx/certs/localhost.crt /usr/share/kibana/config/certs/localhost.crt

CMD ["/bin/bash", "-c", "/usr/local/bin/init_kibana.sh & /usr/local/bin/kibana-docker"]