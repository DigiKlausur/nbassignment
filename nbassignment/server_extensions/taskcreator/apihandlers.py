import json
import os

from tornado import web

from .base import BaseApiHandler, check_xsrf, check_notebook_dir
from ...models import TaskModel, PresetModel
from ...converters import GenerateExercise
from ...utils import NotebookVariableExtractor

class ListTaskPresetsHandler(BaseApiHandler):

    def initialize(self):
        self.__model = PresetModel()

    @web.authenticated
    @check_xsrf
    def get(self):
        self.write(json.dumps(PresetModel().list_question_presets()))

class PresetHandler(BaseApiHandler):

    def initialize(self):
        self.__model = PresetModel()

    @web.authenticated
    @check_xsrf
    def get(self):
        name = self.get_argument('name')
        self.write(json.dumps(PresetModel().get_question_preset(name)))


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
        GenerateExercise().convert(resources)
        self.write({"status": True})

class TemplateVariableHandler(BaseApiHandler):
    @web.authenticated
    @check_xsrf
    def get(self):
        template = self.get_argument("template");
        variables = NotebookVariableExtractor().extract(os.path.join('templates', template, '{}.ipynb'.format(template)))
        self.write(json.dumps(variables))
        
default_handlers = [
    (r"/taskcreator/api/status", StatusHandler),
    (r"/taskcreator/api/tasks", ListTasksHandler),
    (r"/taskcreator/api/generate_exercise", GenerateExerciseHandler),
    (r"/taskcreator/api/templates/variables", TemplateVariableHandler),
    (r"/taskcreator/api/presets/list", ListTaskPresetsHandler),
    (r"/taskcreator/api/presets/get", PresetHandler),
]
