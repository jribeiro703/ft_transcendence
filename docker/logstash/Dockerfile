FROM docker.elastic.co/logstash/logstash:7.10.1

RUN mkdir -p /usr/share/logstash/config/certs/
COPY --chown=logstash:logstash ./docker/nginx/certs/elasticsearch.key /usr/share/logstash/config/certs/elasticsearch.key
COPY --chown=logstash:logstash ./docker/nginx/certs/elasticsearch.crt /usr/share/logstash/config/certs/elasticsearch.crt