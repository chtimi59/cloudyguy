#!/bin/sh
### BEGIN INIT INFO
# Provides:          cloudyguy_heartbeat.sh
# Required-Start:
# Required-Stop:
# Default-Start:     S
# Default-Stop:
# Short-Description: Send heart beat to master server
# Description:       Send heart beat to master server
### END INIT INFO

daemon_NAME="cloudyguy_heartbeat.sh"
export PIDFILE=/tmpcloudyguy_heartbeat
PATH="/sbin:/bin:/usr/sbin:/usr/bin"

#install
#---------
#sudo cp cloudyguy_heartbeat.sh /etc/init.d/. && sudo chmod a+x /etc/init.d/cloudyguy_heartbeat.sh
#sudo update-rc.d cloudyguy_heartbeat.sh defaults

#to uninstall
#---------
#sudo update-rc.d -f cloudyguy_heartbeat.sh remove

. /lib/lsb/init-functions

d_start () {
    while [ true ]
    do
        read MAC </sys/class/net/eth0/address
        IP=`ip addr show eth0 | grep "inet " | cut -d '/' -f1 | cut -d ' ' -f6`
        PUBLIC_IP=`curl -s checkip.dyndns.org --max-time 3 | sed -e 's/.*Current IP Address: //' -e 's/<.*$//'`
        
        if [ ! -z $MAC ] || [ ! -z $IP ] || [ ! -z $PUBLIC_IP ]
        then
            JSON="\"mac\":\"$MAC\""
            JSON=$JSON",\"ip\":\"$IP\""
            JSON=$JSON",\"public\":\"$PUBLIC_IP\""
            JSON="{$JSON}"
            log_success_msg "update: [$MAC] [$IP] [$PUBLIC_IP]"
            if `curl --max-time 3 --fail -s -H "Content-Type: application/json" -X POST -d $JSON http://jdo-dev.org/cloudyguy/api/heartbeat >/dev/null`
            then
                log_success_msg "hearbeat sent"
            else
                log_failure_msg "hearbeat not sent"
            fi
        fi
        sleep 600 #10mn
    done
}

d_stop () {
    if [ -e $PIDFILE ]; then
        kill `cat $PIDFILE`
        rm -f $PIDFILE
    fi
}

case "$1" in

        start)
            if [ -e $PIDFILE ]; then
                log_daemon_msg "Daemon $daemon_NAME already running"
                log_end_msg $?
            else
                log_daemon_msg "Starting system $daemon_NAME Daemon"
                log_end_msg $?
                d_start &
                echo $! > $PIDFILE
            fi
            ;;

        stop)
            if [ -e $PIDFILE ]; then
                log_daemon_msg "Stopping system $daemon_NAME Daemon"
                log_end_msg $?
                d_stop
            fi
            ;;

        restart|reload|force-reload)
                d_stop
                d_start
                ;;

        force-stop)
               d_stop
                killall -q $daemon_NAME || true
                sleep 2
                killall -q -9 $daemon_NAME || true
                ;;

        status)
                status_of_proc "$daemon_NAME" && exit 0 || exit $?
                ;;
        *)
                echo "Usage: sudo /etc/init.d/$daemon_NAME {start|stop|force-stop|restart|reload|force-reload|status}"
                exit 1
                ;;
esac
exit 0