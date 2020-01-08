# Node RED fakeroku

This Node RED module emulates a Roku and it's only purpose is to connect Node RED to Logitech Harmony Hubs. 
It may also work with other devices which can control a Roku.

> Node-RED is a tool for wiring together hardware devices, APIs and online services in new and interesting ways.

## :question: Get Help

For bug reports and feature requests, open issues. :bug:

## :sparkling_heart: Support my projects

I open-source almost everything I can, and I try to reply to everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications _for free_! You can even change the source code and redistribute (even resell it).

However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:

- Starring and sharing the projects you like :rocket:
- [![PayPal][badge_paypal]][paypal-donations] **PayPal**— You can make one-time donations via PayPal. I'll probably buy a ~~coffee~~ tea. :tea:
- [![Support me on using Brave Browser][badge_brave]][brave] **Brave**— It's free for you. Brave is a browser that improves the security and the access time of websites by blocking ads, trackers and scripts. Give the new Brave Browser a try and Brave will contribute to me on your behalf. :wink:
- [![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T6T412CXA) **Ko-fi**— I'll buy a ~~tea~~ coffee. :coffee: :wink:
- ![](./examples/bitcoin.png) **Bitcoin**—You can send me bitcoins at this address (or scanning the code): `3KDjCmXsGFYawmycXRsVwfFbphog117N8P`

Thanks! :heart:

## :cloud: Installation

First of all install [Node-RED](http://nodered.org/docs/getting-started/installation)

```sh
$ sudo npm install -g node-red
```

Then open  the user data directory  `~/.node-red`  and install the package

```sh
$ cd ~/.node-red
$ npm install node-red-contrib-fakeroku
```

Then run

```sh
node-red
```

## :yum: How to contribute

Have an idea? Found a bug? See [how to contribute][contributing].

```sh
git clone https://github.com/naimo84/node-red-contrib-fakeroku.git
cd node-red-contrib-fakeroku
npm install
gulp
cd ~/.node-red
npm install /path/to/node-red-contrib-fakeroku
```

## :memo: Documentation

### Configuration:

- ***LAN-IP*** needs to be the network IP of your Node RED device
- ***Multicast IP*** only change this if you know what you are doing
- ***UUID*** click on add to generate a new uuid for your fakeroku

### Configuration in Harmony APP & Software

Add Roku 3 device following this Guide:
<https://support.myharmony.com/en-us/harmony-experience-with-roku>
You can rename the device on your Harmony.

## :scroll: Credits

* Inspired by Pman's work for ioBroker [ioBroker.fakeroku](https://github.com/Pmant/ioBroker.fakeroku)

## :scroll: The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Coded with :heart: in :it:

[badge_brave]: ./examples/support_banner.png
[badge_paypal]: https://img.shields.io/badge/Donate-PayPal-blue.svg
[paypal-donations]: https://paypal.me/NeumannBenjamin
[brave]: https://brave.com/nai412
[contributing]: /CONTRIBUTING.md
