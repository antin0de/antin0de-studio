#!/bin/bash

while getopts ":it:n:p:" opt; do
  case $opt in
    i)
      INTERACTIVE="1"
      ;;
    t)
      DOMAIN="$OPTARG"
      ;;
    n)
      SCAN_NAME="$OPTARG"
      ;;
    p)
      PASSWORD="$OPTARG"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done

if [[ "$INTERACTIVE" == "1" ]]; then
    read -s -p "Antin0de Studio Password: " PASSWORD
    echo ""
    read -p "Domain Name: " DOMAIN
    echo "Using domain name $DOMAIN"
    read -p "Scan Name: " SCAN_NAME
    echo "Using scan name $SCAN_NAME"
fi

SCAN_DIR="$HOME/.bbot/scans/$SCAN_NAME"
CSV_OUTPUT="$SCAN_DIR/output.csv"

./bbot-docker.sh -t $DOMAIN -n $SCAN_NAME -f subdomain-enum
while IFS="," read -r REC_TYPE REC_VALUE REC_REMAINING
do
    if [[ "$REC_TYPE" == "DNS_NAME" ]]; then
        ./studio-api.sh POST /v1/domains "{\"fqdn\": \"$REC_VALUE\"}" $PASSWORD
    fi
done < <(tail -n +2 $CSV_OUTPUT)
