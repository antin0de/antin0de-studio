#!/bin/bash

while getopts ":f:p:" opt; do
  case $opt in
    f)
      FILE="$OPTARG"
      ;;
    p)
      PASSWORD="$OPTARG"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done

while read -r DOMAIN
do
    sudo nmap -sS --top-ports 1000 "$DOMAIN" | grep open | while read -r LINE ; do
        LINE=$(echo "$LINE" | tr -s ' ')
        PORT_PROTO=$(echo "$LINE" | cut -d' ' -f1)
        PORT=$(echo "$PORT_PROTO" | cut -d'/' -f1)
        PROTO=$(echo "$PORT_PROTO" | cut -d'/' -f2)
        SERVICE=$(echo "$LINE" | cut -d' ' -f3)
        ./studio-api.sh POST /v1/services "{\"fqdn\": \"$DOMAIN\", \"protocol\": \"$PROTO\", \"port\": $PORT, \"name\": \"$SERVICE\"}" $PASSWORD
        echo "$DOMAIN: $PORT $PROTO $SERVICE"
    done
done < $FILE
