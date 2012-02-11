#!/usr/bin/env python

import SimpleHTTPServer
import SocketServer

PORT = 8000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("127.0.0.1", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()
