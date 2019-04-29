#Docker setup

### Google Cloud

Upload image to a registry:
```
export GCP_PROJECT=`gcloud config list core/project --format='value(core.project)'`

sudo docker build -t "gcr.io/${GCP_PROJECT}/py-web-server:v1" .
sudo gcloud docker -- push gcr.io/${GCP_PROJECT}/py-web-server:v1

```

Type: "container registry" in the search bar and check your new container

Let the image publicly acessible:
```
gsutil defacl ch -u AllUsers:R gs://artifacts.${GCP_PROJECT}.appspot.com
gsutil acl ch -r -u AllUsers:R gs://artifacts.${GCP_PROJECT}.appspot.com
gsutil acl ch -u AllUsers:R gs://artifacts.${GCP_PROJECT}.appspot.com
```

Run the image from anywhere:
```
sudo docker run -d -p 8888:8888 -h my-web-server gcr.io/${GCP_PROJECT}/py-web-server:v1
```

Expose port 80
```
kubectl expose deployment closetinn-backend-1 --type=LoadBalancer --port 80 --target-port 80
```

**RUN**
```bash
# build
docker build -t closetinn-backend .

# run
docker run --name closetinn-backend-1 --link closetinn-ml-api-1:local.closetinn.ml.api  closetinn-backend
```
