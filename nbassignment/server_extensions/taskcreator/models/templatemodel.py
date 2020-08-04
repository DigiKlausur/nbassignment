import os
import nbformat

class TemplateModel:

    def __init__(self):
        pass

    def new_template(self, name):
        os.makedirs(os.path.join('templates', name, 'img'), exist_ok=True)
        os.makedirs(os.path.join('templates', name, 'data'), exist_ok=True)
        filename = '{}.ipynb'.format(name)
        nb = nbformat.v4.new_notebook()
        nb.metadata['nbassignment'] = {
            'type': 'template'
        }
        path = os.path.join('templates', name, filename)
        nbformat.write(nb, path)
        url = os.path.join('/', 'notebooks', 'templates', name, filename)

        return url