#!/bin/bash

HOST=$1
METHOD=$2
PATH=$3
DATA=$4
PASSWORD=$5

/usr/bin/curl -X "$METHOD" -H "Content-Type: application/json" "$HOST$PATH?password=$PASSWORD" -d "$DATA"