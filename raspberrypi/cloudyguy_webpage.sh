#!/bin/bash

set -e

PATH=/sbin:/bin:/usr/sbin:/usr/bin

#copy webpage code base
#sudo cp -R cloudyguy_webpage /etc

#run script when IF is mounted
#sudo cp cloudyguy_webpage.sh /etc/network/if-up.d/cloudyguy_webpage && sudo chmod a+x /etc/network/if-up.d/cloudyguy_webpage

sudo node /etc/cloudyguy_webpage/server.js &
