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

class BaseGraderHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    def get(self):
        html = self.render(
            "grader.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            windows=(sys.prefix == 'win32'))
        self.write(html)

class AssignmentHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    def get(self, assignment):
        html = self.render(
            "assignment.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            assignment_name=assignment,
            windows=(sys.prefix == 'win32'))
        self.write(html)

class ExportGradesHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    def get(self):
        html = self.render(
            "export_grades.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            windows=(sys.prefix == 'win32'))
        self.write(html)

class TemplateHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    def get(self):
        html = self.render(
            "templates.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            windows=(sys.prefix == 'win32'))
        self.write(html)

class TaskPoolHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    def get(self):
        html = self.render(
            "pools.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            windows=(sys.prefix == 'win32'))
        self.write(html)

class TaskHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    def get(self, pool):
        html = self.render(
            "tasks.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            pool=pool,
            windows=(sys.prefix == 'win32'))
        self.write(html)

class AssignmentsHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    def get(self):
        html = self.render(
            "assignments.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            windows=(sys.prefix == 'win32'))
        self.write(html)

class StudentHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    def get(self):
        html = self.render(
            "students.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            windows=(sys.prefix == 'win32'))
        self.write(html)

root_path = os.path.dirname(__file__)
template_path = os.path.join(root_path, 'templates')
static_path = os.path.join(root_path, 'static')
components_path = os.path.join(static_path, 'components')
fonts_path = os.path.join(components_path, 'bootstrap', 'fonts')
_navigation_regex = r'(?P<action>new|remove)'

default_handlers = [
    (r"/grader/?", BaseGraderHandler),
    (r"/grader/assignment/(?P<assignment>[^/]+)/?", AssignmentHandler),
    (r"/grader/assignments/?", AssignmentsHandler),
    (r"/grader/export_grades/?", ExportGradesHandler),
    (r"/grader/templates/?", TemplateHandler),
    (r"/grader/pools/?", TaskPoolHandler),
    (r"/grader/pools/(?P<pool>[^/]+)/?", TaskHandler),
    (r"/grader/students/?", StudentHandler),
]
