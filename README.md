# Node RED fakeroku

This Node RED module emulates a Roku and it's only purpose is to connect Node RED to Logitech Harmony Hubs. 
It may also work with other devices which can control a Roku.

> Node-RED is a tool for wiring together hardware devices, APIs and online services in new and interesting ways.

Maintaining **FakeRoku** is very time-consuming, if you like it, please consider:

<a target="blank" href="https://paypal.me/NeumannBenjamin"><img src="https://img.shields.io/badge/Donate-PayPal-blue.svg"/></a>
<a target="blank" href="https://blockchain.info/payment_request?address=3KDjCmXsGFYawmycXRsVwfFbphog117N8P"><img src="https://img.shields.io/badge/Donate-Bitcoin-green.svg"/></a>

## Getting started

First of all install [Node-RED](http://nodered.org/docs/getting-started/installation)

```
$ sudo npm install -g node-red
```

Then open  the user data directory  `~/.node-red`  and install the package

```
$ cd ~/.node-red
$ npm install node-red-contrib-fakeroku
```

Then run

```
node-red
```

## Develop

* git clone https://github.com/naimo84/node-red-contrib-fakeroku.git
* cd node-red-contrib-fakeroku
* npm install
* gulp
* cd ~/.node-red 
* npm install /path/to/node-red-contrib-fakeroku

## Usage

### Configuration:
- ***LAN-IP*** needs to be the network IP of your Node RED device
- ***Multicast IP*** only change this if you know what you are doing
- ***UUID*** click on add to generate a new uuid for your fakeroku

### Configuration in Harmony APP & Software
Add Roku 3 device following this Guide:
https://support.myharmony.com/en-us/harmony-experience-with-roku
You can rename the device on your Harmony.

## Credits
* Inspired by Pman's work for ioBroker [ioBroker.fakeroku](https://github.com/Pmant/ioBroker.fakeroku)

## The MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Coded with :heart: in :it:
