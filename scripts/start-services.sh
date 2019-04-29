#!/bin/bash

#! Lets make it pretty
R='\033[0;31m' # Red
LR='\033[1;31m' # Light Red
G='\033[0;32m' # Green
LG='\033[0;32m' # Light Green
NC='\033[0m' # No Color

echo -e "${LG}---- Welcome to Closetinn ----${NC}"
PROJECT_DIR='/Users/guilherme/Documents/Documents/Projects/Machine Learning/Closetinn/'
BACKEND_DIR='Closetinn - Main API/'
ML_DIR=$BACKEND_DIR
SCRAPPER_DIR=$BACKEND_DIR
CRONJOBS_DIR=$BACKEND_DIR

echo $'\n'

#! Print variables
echo -e "${LG}---- VARIABLES ----${NC}"
echo 'PROJECT_DIR:' $PROJECT_DIR
echo 'ML_DIR:' $ML_DIR
echo 'BACKEND_DIR:' $BACKEND_DIR
echo 'SCRAPPER_DIR:' $SCRAPPER_DIR
echo 'CRONJOBS_DIR:' $CRONJOBS_DIR

echo $'\n'

#! Clean everything after running again
echo -e "${LG}---- Cleaning old containers----${NC}"
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
# kubectl delete daemonsets,replicasets,services,deployments,pods,rc --all

echo $'\n'

#! Build container network
#! echo -e "${LG}---- Creating Network ----${NC}"
#! docker network create --driver bridge closetinn_network

echo $'\n'

#! Run Redis Database
echo -e "${LG}--- Redis Database ---${NC}"
docker run --name redis  -d redis redis-server --appendonly yes

echo $'\n'

#! Run ElasticSearch
echo -e "${LG}--- ElasticSearch ---${NC}"
docker run --name elasticsearch -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.3.1

echo $'\n'

#! Build Socket Server
echo -e "${LG}--- Socket Server Container ---${NC}"
cd "${PROJECT_DIR}${ML_DIR}machineLearning/api/socketServer/"
docker build -t closetinn-server-socket .
# docker run -d --name closetinn-server-socket-primary -e ALIAS='PRIMARY_STATUS' --link redis:redis closetinn-server-socket
# docker run -d --name closetinn-server-socket-slave -e ALIAS='SLAVE_STATUS' --link redis:redis closetinn-server-socket

echo $'\n'

#! Build ML-API
echo -e "${LG}--- ML-API Container ---${NC}"
cd "${PROJECT_DIR}${ML_DIR}machineLearning/api/flask/"
docker build -t closetinn-ml-api .
# docker run -d -p 4000:80 --name closetinn-ml-api --link redis:redis --link closetinn-server-socket-primary:closetinn-server-socket-primary --link closetinn-server-socket-slave:closetinn-server-socket-slave closetinn-ml-api

echo $'\n'

#! Build Backend
echo -e "${LG}--- Backend Container ---${NC}"
cd "${PROJECT_DIR}${BACKEND_DIR}backend/"
docker build -t closetinn-backend .
# docker run -d -p 80:80 -p 443:443 --name closetinn-backend --link elasticsearch:elasticsearch --link closetinn-ml-api:closetinn-ml-api  closetinn-backend

echo $'\n'

#! Build Scrapper
echo -e "${LG}--- Scrapper Container ---${NC}"
cd "${PROJECT_DIR}${SCRAPPER_DIR}scrapper/"
docker build -t closetinn-scrapper .
# docker run -d --name closetinn-scrapper --link closetinn-ml-api:closetinn-ml-api  closetinn-scrapper

echo $'\n'

#! Build Cron Jobs
echo -e "${LG}--- Cron Jobs Container ---${NC}"
cd "${PROJECT_DIR}${CRONJOBS_DIR}cronjobs/"
docker build -t closetinn-cron-jobs .
# docker run -d --name closetinn-cron-jobs --link closetinn-ml-api:closetinn-ml-api --link redis:redis  closetinn-cron-jobs

echo $'\n'

echo ''
echo -e "${LG}--- RUNNING SERVICES ---${NC}"
# docker ps
# kubectl create -f closetinn.yaml

#! Lets get fancy here and start a new tab for each container and follow the logs

#! Backend
# osascript \
# -e 'tell application "iTerm" to activate' \
# -e 'tell application "System Events" to tell process "iTerm" to keystroke "t" using command down' \
# -e 'tell application "System Events" to tell process "iTerm" to keystroke "docker logs -f closetinn-backend"' \
# -e 'tell application "System Events" to tell process "iTerm" to key code 52'

#! ML-API
# osascript \
# -e 'tell application "iTerm" to activate' \
# -e 'tell application "System Events" to tell process "iTerm" to keystroke "t" using command down' \
# -e 'tell application "System Events" to tell process "iTerm" to keystroke "docker logs -f closetinn-ml-api"' \
# -e 'tell application "System Events" to tell process "iTerm" to key code 52'

#! Server Socket Primary
# osascript \
# -e 'tell application "iTerm" to activate' \
# -e 'tell application "System Events" to tell process "iTerm" to keystroke "t" using command down' \
# -e 'tell application "System Events" to tell process "iTerm" to keystroke "docker logs -f closetinn-server-socket-primary"' \
# -e 'tell application "System Events" to tell process "iTerm" to key code 52'

#! Server Socket Slave
# osascript \
# -e 'tell application "iTerm" to activate' \
# -e 'tell application "System Events" to tell process "iTerm" to keystroke "t" using command down' \
# -e 'tell application "System Events" to tell process "iTerm" to keystroke "docker logs -f closetinn-server-socket-slave"' \
# -e 'tell application "System Events" to tell process "iTerm" to key code 52'

#! Scrapper
# osascript \
# -e 'tell application "iTerm" to activate' \
# -e 'tell application "System Events" to tell process "iTerm" to keystroke "t" using command down' \
# -e 'tell application "System Events" to tell process "iTerm" to keystroke "docker logs -f closetinn-scrapper"' \
# -e 'tell application "System Events" to tell process "iTerm" to key code 52'

#! Cron Jobs
# osascript \
# -e 'tell application "iTerm" to activate' \
# -e 'tell application "System Events" to tell process "iTerm" to keystroke "t" using command down' \
# -e 'tell application "System Events" to tell process "iTerm" to keystroke "docker logs -f closetinn-cron-jobs"' \
# -e 'tell application "System Events" to tell process "iTerm" to key code 52'
