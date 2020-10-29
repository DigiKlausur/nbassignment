import json
import os

from tornado import web

from .base import BaseApiHandler, check_xsrf, check_notebook_dir
from ...models import TaskModel, PresetModel
from ...converters import GenerateExercise
from ...utils import NotebookVariableExtractor

class PresetHandler(BaseApiHandler):

    def initialize(self):
        self.__model = PresetModel(self.url_prefix)

    def _list_template(self):
        self.write(json.dumps(self.__model.list_template_presets()))

    def _get_template(self):
        name = self.get_argument('name')
        self.write(json.dumps(self.__model.get_template_preset(name)))

    def _list_question(self):
        self.write(json.dumps(self.__model.list_question_presets()))

    def _get_question(self):
        name = self.get_argument('name')
        self.write(json.dumps(self.__model.get_question_preset(name)))

    @web.authenticated
    @check_xsrf
    def get(self):
        action = self.get_argument('action')
        preset_type = self.get_argument('type')
        handler = getattr(self, '_{}_{}'.format(action, preset_type))
        handler()

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
        tasks = TaskModel(self.url_prefix).list(pool)
        self.write(json.dumps(tasks))

class GenerateExerciseHandler(BaseApiHandler):
    @web.authenticated
    @check_xsrf
    def get(self):
        resources = json.loads(self.get_argument("resources"))
        GenerateExercise(course_prefix=self.url_prefix).convert(resources)
        self.write({"status": True})

class TemplateVariableHandler(BaseApiHandler):
    @web.authenticated
    @check_xsrf
    def get(self):
        template = self.get_argument("template");
        variables = NotebookVariableExtractor().extract(os.path.join(self.url_prefix, 'templates', template, '{}.ipynb'.format(template)))
        self.write(json.dumps(variables))
        
default_handlers = [
    (r"/taskcreator/api/status", StatusHandler),
    (r"/taskcreator/api/tasks", ListTasksHandler),
    (r"/taskcreator/api/generate_exercise", GenerateExerciseHandler),
    (r"/taskcreator/api/templates/variables", TemplateVariableHandler),
    (r"/taskcreator/api/presets", PresetHandler)
]
