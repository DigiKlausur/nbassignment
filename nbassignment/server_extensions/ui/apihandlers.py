import json
import os

from tornado import web

from .base import BaseApiHandler, check_xsrf, check_notebook_dir
from ...models import TaskModel, PresetModel
from ...converters import GenerateExercise
from ...utils import NotebookVariableExtractor

from ...models import (
    AssignmentModel, TemplateModel, TaskModel,
    TaskPoolModel, ExerciseModel)

class TemplateHandler(BaseApiHandler):
    @web.authenticated
    @check_xsrf
    def get(self):
        self.write(json.dumps(TemplateModel().list()))

class TaskPoolHandler(BaseApiHandler):
    @web.authenticated
    @check_xsrf
    def get(self):
        self.write(json.dumps(TaskPoolModel().list()))

class ListTasksHandler(BaseApiHandler):
    @web.authenticated
    @check_xsrf
    def get(self, pool):
        tasks = TaskModel().list(pool)
        self.write(json.dumps(tasks))
        
default_handlers = [
    (r"/grader/api/templates/?", TemplateHandler),
    (r"/grader/api/pools/?", TaskPoolHandler),
    (r"/grader/api/pools/(?P<pool>[^/]+)/?", ListTasksHandler),
]