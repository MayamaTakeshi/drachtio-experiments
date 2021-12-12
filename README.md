# drachtio-experiments

## Overview

A repo preserving our tests with the drachtio platform.


## Setup

###  Built drachio server on my Ubuntu 20.04 Desktop
```
cd work/src/git
git clone --depth=50 --branch=develop git://github.com/davehorton/drachtio-server.git && cd drachtio-server
git submodule update --init --recursive
./autogen.sh
mkdir build && cd $_
../configure CPPFLAGS='-DNDEBUG'
make
sudo make install

```

### preserving commit id:
```
takeshi:drachtio-server$ git log |head -n 5
commit ef92cfcd80f8ab4b19046933f6f745f7053ec2fc
Author: Dave Horton <daveh@beachdognet.com>
Date:   Thu Dec 3 08:57:30 2020 -0500

    remove assertion for case that typically is a result of an application error
```


### created this file
```
takeshi:build$ cat /etc/drachtio.conf.xml
<drachtio>
  <admin port="9022" secret="cymru">127.0.0.1</admin>
  <sip>
    <contacts>
      <contact>sip:127.0.0.1:6060;transport=udp,tcp</contact>
    </contacts>
  </sip>
</drachtio>
```

## Running drachtio server

```
drachtio
```
The above will start drachtio using /etc/drachtio.conf.xml (default location)

But we can specify the file like this
```
drachtio -f drachtio.conf.xml 
```
and so we can start and run multiple instances simultaneously.


## Running the test:
```
npm install
node tests/register_subscribe/test.js
```

