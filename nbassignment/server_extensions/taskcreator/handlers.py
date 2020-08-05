import os
import re
import sys
import nbformat

from tornado import web

from .base import BaseHandler, check_xsrf, check_notebook_dir

from .models import TaskModel, TemplateModel

class Template404(BaseHandler):
    """Render our 404 template"""
    def prepare(self):
        raise web.HTTPError(404)

class ManageTasksHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self):
        html = self.render(
            "taskcreator.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            windows=(sys.prefix == 'win32'))
        self.write(html)

class CreateTaskHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self, name):
        url = TaskModel().new_task(name)
        self.redirect(url)

class DeleteTaskHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    def get(self, name):
        TaskModel().delete_task(name)
        self.redirect('/taskcreator/tasks')

class CreateTemplateHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self, name):
        url = TemplateModel().new_template(name)
        self.redirect(url)

class TaskHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self):
        html = self.render(
            "tasks.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            tasks=TaskModel().get_tasks(),
            windows=(sys.prefix == 'win32'))
        self.write(html)

class TemplateHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self):
        html = self.render(
            "templates.tpl",
            url_prefix=self.url_prefix,
            base_url=self.base_url,
            templates=TemplateModel().get_templates(),
            windows=(sys.prefix == 'win32'))
        self.write(html)

class DeleteTemplateHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    def get(self, name):
        TemplateModel().delete_template(name)
        self.redirect('/taskcreator/templates')


root_path = os.path.dirname(__file__)
template_path = os.path.join(root_path, 'templates')
static_path = os.path.join(root_path, 'static')
components_path = os.path.join(static_path, 'components')
fonts_path = os.path.join(components_path, 'bootstrap', 'fonts')

default_handlers = [
    (r"/taskcreator/?", ManageTasksHandler),
    (r"/taskcreator/new_task/([^/]+)/?", CreateTaskHandler),
    (r"/taskcreator/delete_task/([^/]+)/?", DeleteTaskHandler),
    (r"/taskcreator/tasks/?", TaskHandler),
    (r"/taskcreator/templates/?", TemplateHandler),
    (r"/taskcreator/new_template/([^/]+)/?", CreateTemplateHandler),
    (r"/taskcreator/delete_template/([^/]+)/?", DeleteTemplateHandler),
]
