#!/bin/bash

# Wait for Kibana to start
until curl -s http://localhost:5601/api/status | grep -q '"state":"green"'; do
  echo "Waiting for Kibana to start..."
  sleep 5
done

# Check if the logstash-* index pattern already exists
if curl -s -X GET "http://localhost:5601/api/saved_objects/_find?type=index-pattern&search=logstash-*&search_fields=title" | grep -q '"total":0'; then
  echo "Adding logstash-* index pattern to Kibana"
  # Add index pattern to Kibana
  curl -X POST "http://localhost:5601/api/saved_objects/index-pattern" \
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