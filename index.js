const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const biliPackageDefinition = protoLoader.loadSync(
    [
        __dirname + '/protos/bilibili/pgc/gateway/player/v2/playurl.proto',
        __dirname + '/protos/bilibili/polymer/app/search/v1/search.proto',
        __dirname + '/protos/bilibili/pagination/pagination.proto',
        __dirname + '/protos/bilibili/app/archive/middleware/v1/preload.proto'
    ],
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
const pgcPlayUrl_proto = grpc.loadPackageDefinition(biliPackageDefinition).bilibili.pgc.gateway.player.v2
const search_proto = grpc.loadPackageDefinition(biliPackageDefinition).bilibili.polymer.app.search.v1

const HOST = 'grpc.biliapi.net:443'
const PORT = 8080

function pgcPlayView(call, callback) {
    console.log('path', call.call.handler.path)
    //console.log('request', call.request)

    const client = new pgcPlayUrl_proto.PlayURL(HOST, grpc.credentials.createSsl())
    client.playView(call.request, call.metadata, function (err, response) {
        if (err != null) console.log('err', err)
        //console.log('response', response)
        callback(err, response)
    })
}

function searchByType(call, callback) {
    console.log('path', call.call.handler.path)
    //console.log('request', call.request)

    const client = new search_proto.Search(HOST, grpc.credentials.createSsl())
    client.searchByType(call.request, call.metadata, function (err, response) {
        if (err != null) console.log('err', err)
        //console.log('response', response)
        callback(err, response)
    })
}

function main() {
    const server = new grpc.Server();
    server.addService(pgcPlayUrl_proto.PlayURL.service, {playView: pgcPlayView})
    server.addService(search_proto.Search.service, {searchByType: searchByType})
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
        server.start()
    })
}

main()