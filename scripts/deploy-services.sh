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

#! Login to AWS
# echo -e "${LG}---- LOGIN AWS ----${NC}"
# AWS_LOGIN_COMMAND=`aws ecr get-login --no-include-email --region us-east-2`
# echo $AWS_LOGIN_COMMAND
# eval $AWS_LOGIN_COMMAND

echo $'\n'

#! Deploy ML-API
echo -e "${LG}--- ML-API Container ---${NC}"
cd "${PROJECT_DIR}${ML_DIR}machineLearning/api/flask/"
docker build -t closetinn-ml-api .
docker tag closetinn-ml-api:latest gcr.io/closetinn-197221/closetinn-ml-api:latest
docker push gcr.io/closetinn-197221/closetinn-ml-api:latest
# docker tag closetinn-ml-api:latest 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-ml-api:latest
# docker push 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-ml-api:latest

echo $'\n'

#! Deploy Socket Server
echo -e "${LG}--- Socket Server Container ---${NC}"
cd "${PROJECT_DIR}${ML_DIR}machineLearning/api/socketServer/"
docker build -t closetinn-server-socket .
docker tag closetinn-server-socket:latest gcr.io/closetinn-197221/closetinn-server-socket:latest
docker push gcr.io/closetinn-197221/closetinn-server-socket:latest
# docker tag closetinn-server-socket:latest 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-server-socket:latest
# docker push 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-server-socket:latest

echo $'\n'

#! Deploy Backend
echo -e "${LG}--- Backend Container ---${NC}"
cd "${PROJECT_DIR}${BACKEND_DIR}backend/"
docker build -t closetinn-backend .
docker tag closetinn-backend:latest gcr.io/closetinn-197221/closetinn-backend:latest
docker push gcr.io/closetinn-197221/closetinn-backend:latest
# docker tag closetinn-backend:latest 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-backend:latest
# docker push 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-backend:latest

echo $'\n'

#! Deploy Scrapper
echo -e "${LG}--- Scrapper Container ---${NC}"
cd "${PROJECT_DIR}${SCRAPPER_DIR}scrapper/"
docker build -t closetinn-scrapper .
docker tag closetinn-scrapper:latest gcr.io/closetinn-197221/closetinn-scrapper:latest
docker push gcr.io/closetinn-197221/closetinn-scrapper:latest
# docker tag closetinn-scrapper:latest 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-scrapper:latest
# docker push 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-scrapper:latest

echo $'\n'

#! Deploy Cron Jobs
echo -e "${LG}--- Cron Jobs Container ---${NC}"
cd "${PROJECT_DIR}${CRONJOBS_DIR}cronjobs/"
docker build -t closetinn-cron-jobs .
docker tag closetinn-cron-jobs:latest gcr.io/closetinn-197221/closetinn-cron-jobs:latest
docker push gcr.io/closetinn-197221/closetinn-cron-jobs:latest
# docker tag closetinn-cron-jobs:latest 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-cron-jobs:latest
# docker push 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-cron-jobs:latest

echo $'\n'
