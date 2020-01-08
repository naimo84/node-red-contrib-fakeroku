"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var httpHeaders = require("http-headers");
var http_1 = require("http");
var dgram_1 = require("dgram");
module.exports = function (RED) {
    function FakeRokuNode(config) {
        var socket;
        var server;
        var device;
        var configNode;
        var node = this;
        RED.nodes.createNode(node, config);
        configNode = RED.nodes.getNode(config.confignode);
        device = init(configNode);
        server = http_1.createServer(function (request, response) {
            //request.connection.ref();
            var method = request.method;
            var url = request.url;
            var body = [];
            request.on('error', function (err) {
                node.error(err);
            }).on('data', function (chunk) {
                body.push(chunk);
            }).on('end', function () {
                if (method === 'GET' && url == '/') {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'text/xml; charset=utf-8');
                    response.setHeader('Connection', 'close');
                    response.end(device.DESCXML, function () {
                        request.connection.unref();
                    });
                }
                else {
                    if (method === "GET") {
                        var message = parseQuery(device, url);
                        response.statusCode = 200;
                        response.setHeader('Content-Type', 'text/xml; charset=utf-8');
                        response.setHeader('Connection', 'close');
                        response.end(message, function () {
                            request.connection.unref();
                        });
                    }
                    else {
                        parseCommand(node, url);
                        response.end(function () {
                            request.connection.unref();
                        });
                    }
                }
            });
        }).on('error', function (e) {
            // Handle your error here
            node.error(e);
            node.status({ fill: "red", shape: "ring", text: e.message });
        }).listen(configNode.port, configNode.ip, function () {
            node.debug("fakeroku listening on " + configNode.ip + ":" + configNode.port);
        });
        node.on('close', function () {
            server.close();
        });
        startDiscovery(configNode, socket, device, node);
    }
    function startDiscovery(config, socket, device, node) {
        socket = dgram_1.createSocket({ type: 'udp4', reuseAddr: true });
        socket.on("error", function (error) {
            node.error(error);
            stopDiscovery(socket);
        });
        socket.on("message", function (msg, rinfo) {
            if (msg.toString().indexOf("M-SEARCH") > -1) {
                var headers = httpHeaders(msg);
                node.debug("Remoteinfo: " + rinfo.address);
                if (headers.man === '"ssdp:discover"') {
                    socket.send(device.SSDP_RESPONSE, 0, device.SSDP_RESPONSE.length, rinfo.port, rinfo.address);
                }
            }
        });
        socket.bind(1900, "0.0.0.0", function () {
            try {
                socket.addMembership((config.multicast && config.multicast.length > 0) ? config.multicast : "239.255.255.250");
            }
            catch (error) {
                node.error(error);
            }
            node.debug("SSDP socket binding on port 1900");
        });
    }
    function stopDiscovery(socket) {
        if (socket)
            socket.close();
    }
    function parseCommand(node, command) {
        var message;
        if (message = command.match(/^\/([^\/]+)\/(\S+)$/)) {
            switch (message[1]) {
                case "keypress":
                case "keydown":
                case "keyup":
                    node.send({
                        action: message[1],
                        payload: message[2]
                    });
                    break;
                case "launch":
                case "install":
                    node.debug(message);
                    break;
                default:
                    break;
            }
        }
    }
    function parseQuery(device, query) {
        var message = "";
        switch (query) {
            case "/query/apps":
                message = device.APPSXML;
                break;
            default:
                break;
        }
        return message;
    }
    function init(config) {
        var IP = config.ip;
        var UUID = config.uuid;
        var HTTP_PORT = config.port;
        var SSDP_RESPONSE = new Buffer("HTTP/1.1 200 OK\r\nCache-Control: max-age=300\r\nST: roku:ecp\r\nUSN: uuid:roku:ecp:" +
            UUID +
            "\r\nExt: \r\nServer: Roku UPnP/1.0 MiniUPnPd/1.4\r\nLOCATION: " +
            "http://" + IP + ":" + HTTP_PORT +
            "/\r\n\r\n");
        var DESCXML = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n\t\t\t<root xmlns=\"urn:schemas-upnp-org:device-1-0\">\n\t\t\t<specVersion>\n\t\t\t\t<major>1</major>\n\t\t\t\t<minor>0</minor>\n\t\t\t</specVersion>\n\t\t\t<device>\n\t\t\t\t<deviceType>urn:roku-com:device:player:1-0</deviceType>\n\t\t\t\t<friendlyName>fakeroku</friendlyName>\n\t\t\t\t<manufacturer>naimo84</manufacturer>\n\t\t\t\t<manufacturerURL>https://github.com/naimo84/</manufacturerURL>\n\t\t\t\t<modelDescription>Node Red - fake Roku player</modelDescription>\n\t\t\t\t<modelName>fakeroku</modelName>\n\t\t\t\t<modelNumber>4200X</modelNumber>\n\t\t\t\t<modelURL>https://github.com/naimo84/node-red-contrib-fakeroku</modelURL>\n\t\t\t\t<serialNumber>" + UUID + "</serialNumber>\n\t\t\t\t<UDN>uuid:roku:ecp:" + UUID + "</UDN>\n\t\t\t\t<serviceList>\n\t\t\t\t<service>\n\t\t\t\t\t<serviceType>urn:roku-com:service:ecp:1</serviceType>\n\t\t\t\t\t<serviceId>urn:roku-com:serviceId:ecp1-0</serviceId>\n\t\t\t\t\t<controlURL/>\n\t\t\t\t\t<eventSubURL/>\n\t\t\t\t\t<SCPDURL>ecp_SCPD.xml</SCPDURL>\n\t\t\t\t</service>\n\t\t\t\t</serviceList>\n\t\t\t</device>\n\t\t\t</root>";
        var APPSXML = "<apps>\n\t\t\t<app id=\"11\">Roku Channel Store</app>\n\t\t\t<app id=\"12\">Netflix</app>\n\t\t\t<app id=\"13\">Amazon Video on Demand</app>\n\t\t\t<app id=\"837\">YouTube</app>\n\t\t\t<app id=\"2016\">Crackle</app>\n\t\t\t<app id=\"3423\">Rdio</app>\n\t\t\t<app id=\"21952\">Blockbuster</app>\n\t\t\t<app id=\"31012\">MGO</app>  \n\t\t\t<app id=\"43594\">CinemaNow</app>\n\t\t\t<app id=\"46041\">Sling TV</app>\n\t\t\t<app id=\"50025\">GooglePlay</app>\n\t\t\t</apps>";
        return {
            UUID: UUID,
            HTTP_PORT: HTTP_PORT,
            SSDP_RESPONSE: SSDP_RESPONSE,
            DESCXML: DESCXML,
            APPSXML: APPSXML
        };
    }
    RED.nodes.registerType("fakeroku-device", FakeRokuNode);
};
