#!/bin/bash

# Wait for Kibana to start
until curl -s --cacert /usr/share/kibana/config/certs/localhost.crt --key /usr/share/kibana/config/certs/localhost.key --cert /usr/share/kibana/config/certs/localhost.crt -u $ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD https://localhost:5601/api/status | grep -q '"state":"green"'; do
  echo "Waiting for Kibana to start..."
  sleep 5
done

# Check if the logstash-* index pattern already exists
if curl -s -X GET --cacert /usr/share/kibana/config/certs/localhost.crt --key /usr/share/kibana/config/certs/localhost.key --cert /usr/share/kibana/config/certs/localhost.crt -u $ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD "https://localhost:5601/api/saved_objects/_find?type=index-pattern&search=logstash-*&search_fields=title" | grep -q '"total":0'; then
  echo "Adding logstash-* index pattern to Kibana"
  # Add index pattern to Kibana
  curl -X POST --cacert /usr/share/kibana/config/certs/localhost.crt --key /usr/share/kibana/config/certs/localhost.key --cert /usr/share/kibana/config/certs/localhost.crt -u $ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD "https://localhost:5601/api/saved_objects/index-pattern" \
    -H 'kbn-xsrf: true' \
    -H 'Content-Type: application/json' \
    -d '{
      "attributes": {
        "title": "logstash-*",
        "timeFieldName": "@timestamp"
      }
    }'
else
  echo "logstash-* index pattern already exists in Kibana"
fi