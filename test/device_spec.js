var should = require("should");
var helper = require("node-red-node-test-helper");

helper.init(require.resolve('node-red'));



describe('device Node', function () {

    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload().then(function () {
            helper.stopServer(done);
        });
    });

    it('should be loaded', function (done) {
        var flow = [
            { id: "c1", type: "fakeroku-config" },
            { id: "n1", type: "fakeroku-device", config: "c1" }
        ];
        var fakerokuContainersNode = require("../dist/fakeroku-device.js");
        var fakerokuConfigNode = require("../dist/fakeroku-config.js");



        helper.load([fakerokuConfigNode, fakerokuContainersNode], flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('type', 'fakeroku-device');
            done();
        });
    });

   
});
