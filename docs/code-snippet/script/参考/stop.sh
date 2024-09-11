#! /bin/sh

pid=`ps -ef | grep your-app.jar | grep java | awk '{print $2}'`

#sleep 10
kill -9 $pid >/dev/null 2>&1
