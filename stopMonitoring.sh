#!/bin/bash

printf "Stop to monitoring a site\n---------------------------------------\n"

printf "hostname: "
read -r HOSTNAME

printf "do you want to make it permanent? (y/n): "
read -r CHOICE

if [ -z "${CHOICE}" ] || [ "${COICHE}" == "y" ]
then
    PERM="true"
else
    PERM="false"
fi

printf "\n---------------------------------------\n"

curl -X POST -H "Content-Type: application/json" -d "{\"hostname\": \"${HOSTNAME}\", \"remove\": \"${PERM}\"}" localhost:3000/stopCheck

printf "\n"
