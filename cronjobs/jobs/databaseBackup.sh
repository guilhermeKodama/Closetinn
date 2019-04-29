#!/bin/bash


#! Config crontab on OSX
#! 1 - env EDITOR=nano crontab -e
#! 2 - * * 1 * * cd /Users/guilherme/Documents/Documents/Projects/Machine\ Learning/Closetinn/Closetinn\ -\ CronJobs\ Service/cronjobs/jobs/ && ./databaseBackup.sh >> /var/log/databaseBackup.log
#! crontab -l

#! Lets make it pretty
R='\033[0;31m' # Red
LR='\033[1;31m' # Light Red
G='\033[0;32m' # Green
LG='\033[0;32m' # Light Green
NC='\033[0m' # No Color

PROJECT_DIR='/Users/guilherme/Documents/Documents/Projects/Machine Learning/Closetinn/'
BACKUP_DIR='Closetinn - Backup/'
now=$(date)
CURRENT_DATE="${now}/"

echo -e "${LG}---- Welcome to Closetinn Databse Backup ----${NC}"
echo $'\n'

mkdir "${PROJECT_DIR}${BACKUP_DIR}${CURRENT_DATE}"
mongodump --host Cluster0-shard-0/cluster0-shard-00-00-svs1p.mongodb.net:27017,cluster0-shard-00-01-svs1p.mongodb.net:27017,cluster0-shard-00-02-svs1p.mongodb.net:27017 --ssl --username gkodama --password azzaropourhome2 --authenticationDatabase admin --db fashionbot -o "${PROJECT_DIR}${BACKUP_DIR}${CURRENT_DATE}"
