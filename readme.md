# Uptime 

Simple node.js tool to monitor if a site is online or not. 

There are 3 possible types of check: 
 - ping check, that sends an ICMP echo request packets
 - http, that sends an http request 
 - https, that sends an https request 

To start the service first start a redis container: 
``` bash
    $ docker pull redis:latest
    $ docker run --name uptime-redis -p 6379:6379 -d redis
```

Set 2 environment variable: UPTIMEPORT and REDISURL, you can also use .env file. By default they are:
``` bash
    UPTIMEPORT=3000
    REDISURL="redis://172.17.0.2:6379"
```

Start the node server: 
``` bash
    $ node server.js
```

With the example script start to monitor a site: 
``` bash
    $ ./script/startMonitoring.sh
    Start to monitoring a site
    ---------------------------------------
    hostname: facebook.com
    type: https 
    allow codes (write in array form: [200, 301, ...]): [200, 301]
    method: GET
    path (blank for "/"):
    port port (blank for 80/443): 
    interval: 10000

    ---------------------------------------
    Started
``` 

And check with: 
``` bash
    $ curl localhost:3000 -s | jq
    {
        "facebook.com": "up"
    }

```

To check a particular site: 
``` bash
    $ curl localhost:3000?site=facebook.com -s | jq
```

You can check also the monitoring information with: 
``` bash
    $ curl localhost:3000/info | jq
    {
        "facebook.com:info": {
            "codes": "[200, 301]",
            "hostname": "facebook.com",
            "interval": "10000",
            "method": "GET",
            "type": "https",
            "path": "/",
            "port": "443"
        }
    }
```

To check a particular site: 
``` bash
    $ curl localhost:3000/info?site=facebook.com -s | jq
```

You can stop a monitoring with: 
``` bash
    $ ./script/stopMonitoring.sh
    Stop to monitoring a site
    ---------------------------------------
    hostname: facebook.com
    do you want to make it permanent? (y/n): y

    ---------------------------------------
    Permanently stopped
```

if you don't make it permanent at the first restart the monitoring will resume