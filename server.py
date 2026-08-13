#!/usr/bin/env python3
"""
Chaa Buzz Cafe - Dev Server
Serves static web files with instant cross-origin and proper MIME types.
"""
import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class QuietHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def log_message(self, format, *args):
        # Quiet log for clean console output
        pass

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    try:
        with ReusableTCPServer(("127.0.0.1", PORT), QuietHTTPRequestHandler) as httpd:
            print(f"🚀 Chaa Buzz Cafe Dev Server running at: http://127.0.0.1:{PORT}")
            print(f"📱 Customer Menu Table 7 URL: http://127.0.0.1:{PORT}/?table=7")
            print(f"🤵 Waiter Panel: http://127.0.0.1:{PORT}")
            print(f"🍳 Kitchen Display System: http://127.0.0.1:{PORT}")
            httpd.serve_forever()
    except Exception as e:
        print(f"Server info: {e}")
