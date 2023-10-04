#!/bin/bash

printf "Start to monitoring a site\n---------------------------------------\n"

printf "hostname: "
read -r HOSTNAME

printf "type: "
read -r TYPE 

if [ "${TYPE}" == "ping" ]
then
    printf "interval: "
    read -r INTERVAL

    printf "\n---------------------------------------\n"

    curl -X POST -H "Content-Type: application/json" -d "{\"hostname\": \"${HOSTNAME}\", \"interval\": ${INTERVAL}, \"type\": \"${TYPE}\"}" localhost:3000/startCheck
else
    printf "allow codes (write in array form: [200, 301, ...]): "
    read -r CODES

    printf "method: "
    read -r METHOD

    printf "path (blank for \"/\"): "
    read -r SITEPATH

    if [ -z "${SITEPATH}" ]
    then
        SITEPATH="/"
    fi

    printf "port (blank for 80/443): "
    read -r PORT

    if [ -z "${PORT}" ]
    then
        if [ "${TYPE}" == "http" ]
        then
            PORT=80
        else
            PORT=443
        fi
    fi

    printf "interval: "
    read -r INTERVAL

    printf "\n---------------------------------------\n"

    curl -X POST -H "Content-Type: application/json" -d "{\"codes\": \"${CODES}\", \"hostname\": \"${HOSTNAME}\", \"interval\": \"${INTERVAL}\", \"method\": \"${METHOD}\", \"type\": \"${TYPE}\", \"path\": \"${SITEPATH}\", \"port\": \"${PORT}\"}" localhost:3000/startCheck
fi

printf "\n"
