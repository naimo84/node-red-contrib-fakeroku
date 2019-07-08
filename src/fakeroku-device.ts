import * as  httpHeaders from 'http-headers';
import { Red, Node } from 'node-red';
import { Server, createServer, IncomingMessage, ServerResponse } from 'http';
import { Socket, createSocket } from 'dgram';

export interface Device {
    UUID: string,
    HTTP_PORT: number,
    SSDP_RESPONSE: Buffer,
    DESCXML: string,
    APPSXML: string
}

export interface Config {
    port: number,
    ip: string,
    multicast: string,
    uuid: string
}

module.exports = function (RED: Red) {
    let socket: Socket;
    let server: Server;
    let device: Device;
    let configNode: Config;

    function FakeRokuNode(config: any) {
        RED.nodes.createNode(this, config);
        configNode = RED.nodes.getNode(config.confignode) as unknown as Config;
        device = init(configNode);

        server = startServer(this);
        server.listen(configNode.port, configNode.ip);
        this.on('close', function () {
            server.close();
        });
        startDiscovery(configNode);
    }

    function startServer(node: Node) {
        return createServer((request: IncomingMessage, response: ServerResponse) => {
            request.connection.ref();
            let method = request.method;
            let url = request.url;
            let body = [];

            request.on('error', (err) => {
                console.error(err);
            }).on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                if (method === 'GET' && url == '/') {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'text/xml; charset=utf-8');
                    response.setHeader('Connection', 'close');

                    response.end(device.DESCXML, () => {
                        request.connection.unref();
                    });
                } else {
                    if (method === "GET") {
                        let message = parseQuery(device, url);
                        response.statusCode = 200;
                        response.setHeader('Content-Type', 'text/xml; charset=utf-8');
                        response.setHeader('Connection', 'close');

                        response.end(message, () => {
                            request.connection.unref();
                        });
                    } else {
                        parseCommand(node, url);
                        response.end(() => {
                            request.connection.unref();
                        });
                    }
                }
            });
        });
    }

    function startDiscovery(config: Config) {
        socket = createSocket({ type: 'udp4', reuseAddr: true });
        socket.on("error", (error) => {
            console.error(error);
            stopDiscovery();
        });

        socket.on("message", (msg, rinfo) => {
            if (msg.toString().indexOf("M-SEARCH") > -1) {
                let headers = httpHeaders(msg);
                console.debug("Remoteinfo: " + rinfo.address);
                if (headers.man === '"ssdp:discover"') {
                    socket.send(device.SSDP_RESPONSE, 0, device.SSDP_RESPONSE.length, rinfo.port, rinfo.address);
                }
            }
        });

        socket.bind(1900, "0.0.0.0", () => {
            socket.addMembership((config.multicast && config.multicast.length > 0) ? config.multicast : "239.255.255.250");
            console.debug("SSDP socket binding on port 1900");
        });
    }

    function stopDiscovery() {
        if (socket) socket.close();
    }

    function parseCommand(node: Node, command: string) {
        let message: RegExpMatchArray;
        if (message = command.match(/^\/([^\/]+)\/(\S+)$/)) {
            switch (message[1]) {
                case "keypress":
                case "keydown":
                case "keyup":
                    node.send({
                        action: message[1],
                        payload: message[2]
                    });
                    console.debug(message);
                    break;
                case "launch":
                case "install":
                    console.debug(message);
                    break;
                default:
                    break;
            }
        }
    }

    function parseQuery(device: Device, query: string) {
        let message = "";
        switch (query) {
            case "/query/apps":
                message = device.APPSXML;
                break;
            default:
                break;
        }
        return message;
    }

    function init(config: Config): Device {
        let IP = config.ip;
        let UUID = config.uuid;
        let HTTP_PORT = config.port;

        let SSDP_RESPONSE = new Buffer(
            "HTTP/1.1 200 OK\r\nCache-Control: max-age=300\r\nST: roku:ecp\r\nUSN: uuid:roku:ecp:" +
            UUID +
            "\r\nExt: \r\nServer: Roku UPnP/1.0 MiniUPnPd/1.4\r\nLOCATION: " +
            "http://" + IP + ":" + HTTP_PORT +
            "/\r\n\r\n"
        );

        let DESCXML = `<?xml version="1.0" encoding="UTF-8" ?>
			<root xmlns="urn:schemas-upnp-org:device-1-0">
			<specVersion>
				<major>1</major>
				<minor>0</minor>
			</specVersion>
			<device>
				<deviceType>urn:roku-com:device:player:1-0</deviceType>
				<friendlyName>fakeroku</friendlyName>
				<manufacturer>naimo84</manufacturer>
				<manufacturerURL>https://github.com/naimo84/</manufacturerURL>
				<modelDescription>Node Red - fake Roku player</modelDescription>
				<modelName>fakeroku</modelName>
				<modelNumber>4200X</modelNumber>
				<modelURL>https://github.com/naimo84/node-red-contrib-fakeroku</modelURL>
				<serialNumber>${UUID}</serialNumber>
				<UDN>uuid:roku:ecp:${UUID}</UDN>
				<serviceList>
				<service>
					<serviceType>urn:roku-com:service:ecp:1</serviceType>
					<serviceId>urn:roku-com:serviceId:ecp1-0</serviceId>
					<controlURL/>
					<eventSubURL/>
					<SCPDURL>ecp_SCPD.xml</SCPDURL>
				</service>
				</serviceList>
			</device>
			</root>`;


        let APPSXML = `<apps>
			<app id="11">Roku Channel Store</app>
			<app id="12">Netflix</app>
			<app id="13">Amazon Video on Demand</app>
			<app id="837">YouTube</app>
			<app id="2016">Crackle</app>
			<app id="3423">Rdio</app>
			<app id="21952">Blockbuster</app>
			<app id="31012">MGO</app>  
			<app id="43594">CinemaNow</app>
			<app id="46041">Sling TV</app>
			<app id="50025">GooglePlay</app>
			</apps>`;

        return {
            UUID: UUID,
            HTTP_PORT: HTTP_PORT,
            SSDP_RESPONSE: SSDP_RESPONSE,
            DESCXML: DESCXML,
            APPSXML: APPSXML
        };
    }

    RED.nodes.registerType("fakeroku-device", FakeRokuNode);

}
