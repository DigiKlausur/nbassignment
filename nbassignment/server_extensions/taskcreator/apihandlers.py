import json
import os

from tornado import web

from .base import BaseApiHandler, check_xsrf, check_notebook_dir

class StatusHandler(BaseApiHandler):
    @web.authenticated
    @check_xsrf
    def get(self):
        self.write({"status": True})
        
default_handlers = [
    (r"/taskcreator/api/status", StatusHandler),    
]
