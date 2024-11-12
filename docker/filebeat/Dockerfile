FROM docker.elastic.co/beats/filebeat:7.10.1

USER root
RUN mkdir -p /usr/share/filebeat/config/certs/
COPY --chown=filebeat:filebeat ./docker/nginx/certs/elasticsearch.key /usr/share/filebeat/config/certs/elasticsearch.key
COPY --chown=filebeat:filebeat ./docker/nginx/certs/elasticsearch.crt /usr/share/filebeat/config/certs/elasticsearch.crt
USER filebeat