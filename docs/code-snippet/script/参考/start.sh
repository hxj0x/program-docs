#! /bin/sh
java -server -Xmx2048m -Xms2048m -Xmn512m -cp ".:./your-app.jar:./lib/*" org.example.YourAppMainClassName --spring.profiles.active=dev >/dev/null 2>&1 &
