#!/bin/bash

# Wait for Elasticsearch to start
until curl -s -u "$ELASTIC_USERNAME:$ELASTIC_PASSWORD" --cacert /usr/share/elasticsearch/config/certs/elasticsearch.crt --key /usr/share/elasticsearch/config/certs/elasticsearch.key --cert /usr/share/elasticsearch/config/certs/elasticsearch.crt https://localhost:9200/_cluster/health | jq -e '.status == "green" or .status == "yellow"' > /dev/null; do
  echo "Waiting for Elasticsearch to start..."
  sleep 5
done

# Apply ILM policy
curl -X PUT -u "$ELASTIC_USERNAME:$ELASTIC_PASSWORD" --cacert /usr/share/elasticsearch/config/certs/elasticsearch.crt --key /usr/share/elasticsearch/config/certs/elasticsearch.key --cert /usr/share/elasticsearch/config/certs/elasticsearch.crt "https://localhost:9200/_ilm/policy/logs_policy" -H 'Content-Type: application/json' -d '{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_size": "50GB",
            "max_age": "30d"
          }
        }
      },
      "delete": {
        "min_age": "90d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}'

# Create snapshot repository
curl -X PUT -u "$ELASTIC_USERNAME:$ELASTIC_PASSWORD" --cacert /usr/share/elasticsearch/config/certs/elasticsearch.crt --key /usr/share/elasticsearch/config/certs/elasticsearch.key --cert /usr/share/elasticsearch/config/certs/elasticsearch.crt "https://localhost:9200/_snapshot/logs_backup" -H 'Content-Type: application/json' -d '{
  "type": "fs",
  "settings": {
    "location": "/usr/share/elasticsearch/snapshots"
  }
}'

# Apply ILM policy to index template
curl -X PUT -u "$ELASTIC_USERNAME:$ELASTIC_PASSWORD" --cacert /usr/share/elasticsearch/config/certs/elasticsearch.crt --key /usr/share/elasticsearch/config/certs/elasticsearch.key --cert /usr/share/elasticsearch/config/certs/elasticsearch.crt "https://localhost:9200/_template/logs_template" -H 'Content-Type: application/json' -d '{
  "index_patterns": ["logstash-*"],
  "settings": {
    "index.lifecycle.name": "logs_policy",
    "index.lifecycle.rollover_alias": "logstash"
  }
}'