#Running the project

#Docker setup

**PRODUCTION TASK DEFINITION**
```bash
# build
docker build -t closetinn-server-socket .
docker build -t closetinn-ml-api .
docker build -t closetinn_cron_jobs .


# keep in mind that you need the Recommendation API and Server Socket running
docker run --name closetinn-server-socket-1  closetinn-server-socket
docker run --name closetinn-ml-api-1 --link closetinn-server-socket-1:local.closetinn.server.socket  closetinn-ml-api

# run your container
docker run --name closetinn_cron_jobs-1 --link closetinn-ml-api-1:local.closetinn.ml.api  closetinn_cron_jobs
```

**Main flow to build and run docker containers**
```bash
# if is first time build the network
docker network create closetinn_network

# build
docker build -t closetinn-cron-jobs .

# run
docker run --rm -t closetinn-cron-jobs

```

#Google Cloud

```
export GCP_PROJECT=`gcloud config list core/project --format='value(core.project)'` &&
docker build -t "gcr.io/${GCP_PROJECT}/closetinn-cron-jobs:latest" . &&
gcloud docker -- push gcr.io/${GCP_PROJECT}/closetinn-cron-jobs:latest
```
