#!/bin/bash

set -e

PATH=/sbin:/bin:/usr/sbin:/usr/bin

#sudo cp -R cloudyguy_webpage /etc
#sudo cp cloudyguy_webpage.sh /etc/network/if-up.d/cloudyguy_webpage && sudo chmod a+x /etc/network/if-up.d/cloudyguy_webpage

#sudo /usr/sbin/irbrgd start
sudo node /etc/cloudyguy_webpage/server.js &
