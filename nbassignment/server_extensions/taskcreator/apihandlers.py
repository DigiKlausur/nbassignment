import json
import os

from tornado import web

from .base import BaseApiHandler, check_xsrf, check_notebook_dir
from ...models import TaskModel
from ...converters import GenerateExercise


class StatusHandler(BaseApiHandler):
    @web.authenticated
    @check_xsrf
    def get(self):
        self.write({"status": True})

class ListTasksHandler(BaseApiHandler):
    @web.authenticated
    @check_xsrf
    def get(self):
        pool = self.get_argument("pool");
        tasks = TaskModel().list(pool)
        self.write(json.dumps(tasks))

class GenerateExerciseHandler(BaseApiHandler):
    @web.authenticated
    @check_xsrf
    def get(self):
        resources = json.loads(self.get_argument("resources"))
        GenerateExercise().generate(
            resources['assignment'], 
            resources['exercise'], 
            resources['template'], 
            resources['tasks']
        )
        self.write({"status": True})
        
default_handlers = [
    (r"/taskcreator/api/status", StatusHandler),
    (r"/taskcreator/api/tasks", ListTasksHandler),
    (r"/taskcreator/api/generate_exercise", GenerateExerciseHandler)
]
