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

class CreateQuestionHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self, name):
        url = TaskModel().new_task(name)
        self.redirect(url)

class CreateTemplateHandler(BaseHandler):

    @web.authenticated
    @check_xsrf
    @check_notebook_dir
    def get(self, name):
        url = TemplateModel().new_template(name)
        self.redirect(url)




root_path = os.path.dirname(__file__)
template_path = os.path.join(root_path, 'static', 'templates')
static_path = os.path.join(root_path, 'static')
components_path = os.path.join(static_path, 'components')
fonts_path = os.path.join(components_path, 'bootstrap', 'fonts')

default_handlers = [
    (r"/taskcreator/?", ManageTasksHandler),
    (r"/taskcreator/new_question/([^/]+)/?", CreateQuestionHandler),
    (r"/taskcreator/new_template/([^/]+)/?", CreateTemplateHandler),
]
