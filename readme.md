# Uptime 

Simple node.js tool to monitor if a site is online or not. 

Start a redis container: 
``` bash
    $ docker pull redis:latest
    $ docker run --name uptime-redis -p 6379:6379 -d redis
```

Start the node server: 
``` bash
    $ node server.js
```

With the example script start to monitor a site: 
``` bash
    $ bash startMonitoring.sh
    Start to monitoring a site
    ---------------------------------------
    hostname: facebook.com
    type: https
    allow codes (write in array form: [200, 301, ...]): [200, 301]
    method: GET
    path (blank for "/"):
    port: 443
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
    $ ./stopMonitoring.sh
    Stop to monitoring a site
    ---------------------------------------
    hostname: facebook.com
    do you want to make it permanent? (y/n):

    ---------------------------------------
    Stopped
```

if you don't make it permanent at the first restart the monitoring will resume