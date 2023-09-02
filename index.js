const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const pgcPlayUrlPackageDefinition = protoLoader.loadSync(
    __dirname + '/protos/bilibili/pgc/gateway/player/v2/playurl.proto',
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const pgcPlayUrl_proto = grpc.loadPackageDefinition(pgcPlayUrlPackageDefinition).bilibili.pgc.gateway.player.v2;

const HOST = 'grpc.biliapi.net:443'
const PORT = 8080

function pgcPlayView(call, callback) {
    console.log('path', call.call.handler.path)
    //console.log('request', call.request)

    const client = new pgcPlayUrl_proto.PlayURL(HOST, grpc.credentials.createSsl());
    client.playView(call.request, call.metadata, function (err, response) {
        if (err != null) console.log('err', err)
        //console.log('response', response)
        callback(err, response)
    })
}

function main() {
    const server = new grpc.Server();
    server.addService(pgcPlayUrl_proto.PlayURL.service, {playView: pgcPlayView});
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
    });
}

main();