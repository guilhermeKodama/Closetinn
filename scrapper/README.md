#Running the project

#Docker setup

**PRODUCTION TASK DEFINITION**
```bash
# build
docker build -t closetinn-scrapper .

# run your container
docker run --name closetinn-scrapper-1 closetinn-scrapper
```
#Google Cloud

```
export GCP_PROJECT=`gcloud config list core/project --format='value(core.project)'` &&
docker build -t "gcr.io/${GCP_PROJECT}/closetinn-scrapper:latest" . &&
gcloud docker -- push gcr.io/${GCP_PROJECT}/closetinn-scrapper:latest
```
