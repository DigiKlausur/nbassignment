import os
import re
import sys
import nbformat

from tornado import web

from .base import BaseHandler, check_xsrf, check_notebook_dir

from ...models import (
    AssignmentModel, TemplateModel, TaskModel,
    TaskPoolModel, ExerciseModel)

class Template404(BaseHandler):
    """Render our 404 template"""
    def prepare(self):
        raise web.HTTPError(404)

class TestHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    def get(self):
        html = self.render(
            "redesign/test.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            windows=(sys.prefix == 'win32'))
        self.write(html)

class TestAssignmentHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    def get(self, assignment):
        html = self.render(
            "redesign/assignment.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            assignment_name=assignment,
            windows=(sys.prefix == 'win32'))
        self.write(html)


class TaskcreatorHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self):
        '''
        html = self.render(
            "taskcreator.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            windows=(sys.prefix == 'win32'))
        self.write(html)
        '''
        self.redirect('/taskcreator/assignments')

class ManageAssignmentsHandler(BaseHandler):

    def initialize(self):
        self._model = AssignmentModel()

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self):
        html = self.render(
            "assignments.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            assignments=self._model.list(),
            windows=(sys.prefix == 'win32'))
        self.write(html)

class ManageExercisesHandler(BaseHandler):

    def initialize(self):
        self._model = ExerciseModel()

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self, assignment):
        html = self.render(
            "exercises.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            exercises=self._model.list(assignment),
            assignment=assignment,
            windows=(sys.prefix == 'win32'))
        self.write(html)

class ExerciseHandler(BaseHandler):

    def initialize(self):
        self._model = ExerciseModel()

    def _remove(self, name, assignment):
        self._model.remove(assignment, name)
        self.redirect('/taskcreator/assignments/{}'.format(assignment))        

    @web.authenticated
    @check_xsrf
    def get(self, action, name, assignment):
        handler = getattr(self, '_{}'.format(action))
        handler(name, assignment)

class EditExercisesHandler(BaseHandler):

    def initialize(self):
        self._model = ExerciseModel()

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self, assignment, exercise):
        html = self.render(
            "editexercise.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            exercise=exercise,
            assignment=assignment,
            templates=TemplateModel().list(),
            pools=TaskPoolModel().list(),
            windows=(sys.prefix == 'win32'))
        self.write(html)

class ManageTasksHandler(BaseHandler):

    def initialize(self):
        self._model = TaskModel()

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self, pool):
        html = self.render(
            "tasks.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            tasks=self._model.list(pool),
            pool=pool,
            windows=(sys.prefix == 'win32'))
        self.write(html)

class TaskHandler(BaseHandler):

    def initialize(self):
        self._model = TaskModel()

    def _new(self, name, pool):
        url = self._model.new(name, pool)
        self.redirect(url)

    def _remove(self, name, pool):
        self._model.remove(name, pool)
        self.redirect('/taskcreator/pools/{}'.format(pool))        

    @web.authenticated
    @check_xsrf
    def get(self, action, name, pool):
        handler = getattr(self, '_{}'.format(action))
        handler(name, pool)

class ManageTaskPoolsHandler(BaseHandler):

    def initialize(self):
        self._model = TaskPoolModel()

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self):
        html = self.render(
            "taskpools.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            taskpools=self._model.list(),
            windows=(sys.prefix == 'win32'))
        self.write(html)

class TaskPoolHandler(BaseHandler):

    def initialize(self):
        self._model = TaskPoolModel()

    def _new(self, name):
        url = self._model.new(name)
        self.redirect(url)

    def _remove(self, name):
        self._model.remove(name)
        self.redirect('/taskcreator/pools')        

    @web.authenticated
    @check_xsrf
    def get(self, action, name):
        handler = getattr(self, '_{}'.format(action))
        handler(name)

class ManageTemplatesHandler(BaseHandler):

    def initialize(self):
        self._model = TemplateModel()

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self):
        html = self.render(
            "templates.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            templates=self._model.list(),
            windows=(sys.prefix == 'win32'))
        self.write(html)

class TemplateHandler(BaseHandler):

    def initialize(self):
        self._model = TemplateModel()

    def _new(self, name):
        url = self._model.new(name)
        self.redirect(url)

    def _remove(self, name):
        self._model.remove(name)
        self.redirect('/taskcreator/templates')        

    @web.authenticated
    @check_xsrf
    def get(self, action, name):
        handler = getattr(self, '_{}'.format(action))
        handler(name)


root_path = os.path.dirname(__file__)
template_path = os.path.join(root_path, 'templates')
static_path = os.path.join(root_path, 'static')
components_path = os.path.join(static_path, 'components')
fonts_path = os.path.join(components_path, 'bootstrap', 'fonts')
_navigation_regex = r'(?P<action>new|remove)'

default_handlers = [
    (r"/taskcreator/?", TaskcreatorHandler),
    (r"/taskcreator/assignments/?", ManageAssignmentsHandler),
    (r"/taskcreator/assignments/(?P<assignment>[^/]+)/?", ManageExercisesHandler),
    (r"/taskcreator/assignments/(?P<assignment>[^/]+)/{}/(?P<name>[^/]+)/?".format(_navigation_regex), ExerciseHandler),
    (r"/taskcreator/assignments/(?P<assignment>[^/]+)/(?P<exercise>[^/]+)/?", EditExercisesHandler),
    (r"/taskcreator/pools/?", ManageTaskPoolsHandler),
    (r"/taskcreator/pools/{}/(?P<name>[^/]+)/?".format(_navigation_regex), TaskPoolHandler),
    (r"/taskcreator/pools/(?P<pool>[^/]+)/?", ManageTasksHandler),
    (r"/taskcreator/pools/(?P<pool>[^/]+)/{}/(?P<name>[^/]+)/?".format(_navigation_regex), TaskHandler),
    (r"/taskcreator/templates/?", ManageTemplatesHandler),
    (r"/taskcreator/templates/{}/(?P<name>[^/]+)/?".format(_navigation_regex), TemplateHandler),

    (r"/taskcreator/test/?", TestHandler),
    (r"/taskcreator/assignment/(?P<assignment>[^/]+)/?", TestAssignmentHandler)
]
