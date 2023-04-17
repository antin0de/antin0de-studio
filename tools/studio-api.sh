#!/bin/bash

METHOD=$1
PATH=$2
DATA=$3
PASSWORD=$4

/usr/bin/curl -X "$METHOD" -H "Content-Type: application/json" "http://localhost:8080$PATH?password=$PASSWORD" -d "$DATA"