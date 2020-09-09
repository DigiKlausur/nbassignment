# coding: utf-8

import os

from traitlets import default
from tornado import web
from jinja2 import Environment, FileSystemLoader
from notebook.utils import url_path_join as ujoin

from . import handlers, apihandlers
from nbgrader.apps.baseapp import NbGrader

from ...config import ConfigManager

class TaskcreatorExtension(NbGrader):

    name = u'taskcreator'
    description = u'Create a jupyter notebook assignment'
    config_file_name = ConfigManager.config_name

    @default("classes")
    def _classes_default(self):
        classes = super(TaskcreatorExtension, self)._classes_default()
        return classes

    def build_extra_config(self):
        extra_config = super(TaskcreatorExtension, self).build_extra_config()

        return extra_config

    def init_tornado_settings(self, webapp):
        # Init jinja environment
        jinja_env = Environment(loader=FileSystemLoader([handlers.template_path]))
        self.log.info('[NBASSIGNMENT] Template Path {}'.format(handlers.template_path))

        # Configure the formgrader settings
        tornado_settings = dict(
            nbassignment_url_prefix=os.path.relpath(self.coursedir.root, self.parent.notebook_dir),
            nbassignment_coursedir=self.coursedir,
            nbassignment_authenticator=self.authenticator,
            nbassignment_gradebook=None,
            nbassignment_db_url=self.coursedir.db_url,
            nbassignment_jinja2_env=jinja_env,
        )

        webapp.settings.update(tornado_settings)

    def init_handlers(self, webapp):
        h = []
        h.extend(handlers.default_handlers)
        h.extend(apihandlers.default_handlers)
        h.extend([
            (r"/taskcreator/static/(.*)", web.StaticFileHandler, {'path': handlers.static_path}),
            (r"/taskcreator/.*", handlers.Template404)
        ])

        def rewrite(x):
            pat = ujoin(webapp.settings['base_url'], x[0].lstrip('/'))
            return (pat,) + x[1:]

        webapp.add_handlers(".*$", [rewrite(x) for x in h])

    def start(self):
        raise NotImplementedError


def load_jupyter_server_extension(nbapp):
    """Load the formgrader extension"""
    nbapp.log.info("Loading the e2x taskcreator serverextension")
    webapp = nbapp.web_app
    taskcreator = TaskcreatorExtension(parent=nbapp)
    taskcreator.log = nbapp.log
    taskcreator.initialize([])
    taskcreator.init_tornado_settings(webapp)
    taskcreator.init_handlers(webapp)

