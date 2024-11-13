FROM docker.elastic.co/elasticsearch/elasticsearch:7.10.1

COPY ./docker/elasticsearch/init_elasticsearch.sh /usr/share/elasticsearch/init_elasticsearch.sh
RUN chmod +x /usr/share/elasticsearch/init_elasticsearch.sh
RUN mkdir -p /usr/share/elasticsearch/config/certs/
COPY --chown=elasticsearch:elasticsearch ./docker/nginx/certs/elasticsearch.key /usr/share/elasticsearch/config/certs/elasticsearch.key
COPY --chown=elasticsearch:elasticsearch ./docker/nginx/certs/elasticsearch.crt /usr/share/elasticsearch/config/certs/elasticsearch.crt
RUN chmod 644 /usr/share/elasticsearch/config/certs/elasticsearch.key
RUN chmod 644 /usr/share/elasticsearch/config/certs/elasticsearch.crt
RUN mkdir -p /usr/share/elasticsearch/data
RUN chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/data

RUN curl -L -o /usr/bin/jq https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 && \
    chmod +x /usr/bin/jq

CMD ["/bin/bash", "-c", "/usr/share/elasticsearch/init_elasticsearch.sh & /usr/local/bin/docker-entrypoint.sh"]