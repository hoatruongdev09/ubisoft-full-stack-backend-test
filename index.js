const http = require('http')
const app = require('./app')
const port = process.env.PORT || 8080

const server = http.createServer(app)

server.listen(port)
console.log(`server is now listen of port: ${port}`)