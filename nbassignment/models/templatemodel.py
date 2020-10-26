import os
import nbformat
import shutil
from .basemodel import BaseModel
from traitlets import Unicode


class TemplateModel(BaseModel):

    directory = Unicode(
        'templates',
        help='The directory where the task pools go.'
    )

    def __init__(self):
        os.makedirs(self.base_path(), exist_ok=True)

    def new(self, name):
        os.makedirs(os.path.join(self.base_path(), name, 'img'), exist_ok=True)
        os.makedirs(os.path.join(self.base_path(), name, 'data'), exist_ok=True)
        filename = '{}.ipynb'.format(name)
        nb = nbformat.v4.new_notebook()
        nb.metadata['nbassignment'] = {
            'type': 'template'
        }
        path = os.path.join(self.base_path(), name, filename)
        nbformat.write(nb, path)
        url = os.path.join('/', 'notebooks', 'templates', name, filename)

        return url

    def remove(self, name):
        shutil.rmtree(os.path.join(self.base_path(), name))

    def list(self):
        templatefolders = os.listdir(self.base_path())
        templates = []
        for templatefolder in templatefolders:
            templates.append({
                'name': templatefolder,
                'link': os.path.join('tree', 'templates', templatefolder)
            })
        
        return templates