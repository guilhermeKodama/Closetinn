#!/bin/bash
# Use > 1 to consume two arguments per pass in the loop (e.g. each
# argument has a corresponding value to go with it).
# Use > 0 to consume one or more arguments per pass in the loop (e.g.
# some arguments don't have a corresponding value to go with it)

usage() {
    echo "Usage $0 -d /mongodump/dir -c mongo_docker_container_name -n docker_network"
}

while [[ $# > 1 ]]
do
key="$1"

case $key in
    -d|--dump)
        DUMPDIR="$2"
        shift # past argument
        ;;
    -c|--container)
        CONTAINERNAME="$2"
        shift # past argument
        ;;
    -n|--network)
        NETWORK="$2"
        shift # past argument
        ;;
    *)
    	usage
	exit 1
    	;;
esac
shift # past argument or value
done

if [ -z "${DUMPDIR}" -o -z "${CONTAINERNAME}" ]; then
    usage
    exit 1
fi

echo "Attempting to restore mongodb dump at ${DUMPDIR} into container ${CONTAINERNAME}"
read -r -p "Is this what you want? [y/N] " response
case $response in
    [yY][eE][sS]|[yY])
	docker run -it --network ${NETWORK} --rm --name mongorestore -v ${DUMPDIR}:/var/dump --link ${CONTAINERNAME}:${CONTAINERNAME} mongo mongorestore --host ${CONTAINERNAME} /var/dump
        ;;
    *)
        echo "Nevermind then"
        ;;
esac
