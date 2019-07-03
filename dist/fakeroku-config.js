module.exports = function (RED) {
    function FakeRokuConfig(config) {
        RED.nodes.createNode(this, config);
        this.ip = config.ip;
        this.multicast = config.multicast;
        this.uuid = config.uuid;
        this.port = config.port;
    }
    RED.httpAdmin.get("/fakeroku_uuid", function (req, res) {
        res.json(require('crypto').createHash('md5').update(require('crypto').randomBytes(256)).digest("hex"));
    });
    RED.nodes.registerType("fakeroku-config", FakeRokuConfig);
};
