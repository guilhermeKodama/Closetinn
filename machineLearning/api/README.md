#Running the project

Add this to your `/etc/hosts`
```
127.0.0.1	local.closetinn.server.socket
```

Running servers
```
python /flask/src/mainpy

python /socketServer/src/server,py
```

#Docker setup

**PRODUCTION TASK DEFINITION**
```bash
# create network
docker network create --driver bridge closetinn_network

# run redis
docker run --name redis --net=closetinn_network -d redis redis-server --appendonly yes

# build
docker build -t closetinn-ml-api .
docker build -t closetinn-server-socket .

# run
docker run --name closetinn-server-socket-primary --net=closetinn_network closetinn-server-socket
docker run --name closetinn-server-socket-slave --net=closetinn_network closetinn-server-socket
docker run -p 4000:80 --name closetinn-ml-api-1 --net=closetinn_network closetinn-ml-api
```

**Main flow to build and run docker containers**
```bash
# if is first time build the network
docker network create closetinn_network

# build
docker build -t closetinn_flask_api_image .
docker build -t closetinn_server_socket_image .

# run
docker run --rm -t --add-host=database:172.18.0.0 --network-alias local.closetinn.server.socket --network closetinn_network closetinn_server_socket_image
docker run --rm -p 4000:80 --network closetinn_network -t closetinn_flask_api_image

```



**Docker commands**
```bash

# check network
docker network inspect bridge

# CREATE CUSTOM NETWORK
docker network create closetinn_network
# run server
sudo docker run --network-alias server_socket --network closetinn_network -it serverimage
# run client
sudo docker run --network closetinn_network -it clientimage


# get inside a container
docker exec -it 30cdfdb9e1d5 bash

# This tells Docker to build a container using the project in the present working directory (the . at the end), and tag it closetinn_flask_api (-t stands for “tag”).
# Docker will pull down the base image tiangolo/uwsgi-nginx-flask:flask from Docker Hub, then copy our app code into the container.

docker build --no-cache=true -t closetinn_flask_api_image .
docker build --no-cache=true -t closetinn_server_socket_image .

# Run the container connecting the port 80 from the container to the 8000 of your machine
docker run --rm -t --network-alias local.closetinn.server.socket --network closetinn_network closetinn_server_socket_image
docker run --rm -p 4000:80 --network closetinn_network -t closetinn_flask_api_image

# How to run the container in the background persistely
# docker run -d --restart=always -p 8000:80 -t closetinn_flask_api

# stop the containers
docker stop $(docker ps -a -q)
```

#AWS

To install the AWS CLI and Docker and for more information on the steps below, visit the ECR documentation page.
1) Retrieve the docker login command that you can use to authenticate your Docker client to your registry:
Note:
If you receive an "Unknown options: --no-include-email" error, install the latest version of the AWS CLI. Learn more
```bash
aws ecr get-login --no-include-email --region us-east-2
```

2) Run the docker login command that was returned in the previous step.

3) Build your Docker image using the following command. For information on building a Docker file from scratch see the instructions here. You can skip this step if your image is already built:
```bash
docker build -t closetinn-ml-api .
docker build -t closetinn-server-socket .
```

4) After the build completes, tag your image so you can push the image to this repository:
```bash
docker tag closetinn-ml-api:latest 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-ml-api:latest
docker tag closetinn-server-socket:latest 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-server-socket:latest
```

5) Run the following command to push this image to your newly created AWS repository:
```
docker push 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-ml-api:latest
docker push 293217335714.dkr.ecr.us-east-2.amazonaws.com/closetinn-server-socket:latest
```
