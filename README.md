# Closetinn

**Vision:** Pessoas tem interese em um serviço que facilite encontrar roupas baseadas no seu perfil.

**Problem:** As pessoas não encontram roupas que se encaixem nas suas preferências.

## Local Development

run containers
```
# only need this first time or if you changed something in the code
docker-compose build

# run all services
docker-compose up

# stop all services
docker-compose down
```

restore mongodb container
```
./scripts/restore-db.sh -d /Users/guilherme/dump -c closetinn-mainapi_mongodb_1_d97ec06c24e8 -n closetinn-mainapi_default
```

## Kubernetes

```
gcloud container clusters \
    get-credentials cluster-1 \
    --zone southamerica-east1-a

kubectl get nodes
```

### How to run
```bash
# on project root
scrapy crawl dafiti
scrapy crawl farfetch
scrapy crawl kanui
scrapy crawl passarela
```

### Deploy
Our scrapper runs on ScrapyHub a platform created by Scrapy team that allows us to deploy our spiders and monitor with a handy dashboard.

### Config host

add this to your /etc/hosts
```bash
127.0.0.1       local.closetinn.com.br
```

### Elastic Search

```
docker pull docker.elastic.co/elasticsearch/elasticsearch:6.3.1
// run on development mode
docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.3.1
```

### Connect mongodb prod

```
mongo "mongodb://cluster0-shard-00-00-svs1p.mongodb.net:27017,cluster0-shard-00-01-svs1p.mongodb.net:27017,cluster0-shard-00-02-svs1p.mongodb.net:27017/test?replicaSet=Cluster0-shard-0" --ssl --authenticationDatabase admin --username gkodama --password
```
