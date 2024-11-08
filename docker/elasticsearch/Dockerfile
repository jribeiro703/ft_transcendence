FROM docker.elastic.co/elasticsearch/elasticsearch:7.10.1

COPY ./docker/elasticsearch/init_elasticsearch.sh /usr/share/elasticsearch/init_elasticsearch.sh
RUN chmod +x /usr/share/elasticsearch/init_elasticsearch.sh

CMD ["/bin/bash", "-c", "/usr/share/elasticsearch/init_elasticsearch.sh & /usr/local/bin/docker-entrypoint.sh"]