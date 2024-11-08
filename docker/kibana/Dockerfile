FROM docker.elastic.co/kibana/kibana:7.10.1

COPY --chown=kibana:kibana ./docker/kibana/init_kibana.sh /usr/local/bin/init_kibana.sh
RUN chmod +x /usr/local/bin/init_kibana.sh

CMD ["/bin/bash", "-c", "/usr/local/bin/init_kibana.sh & /usr/local/bin/kibana-docker"]