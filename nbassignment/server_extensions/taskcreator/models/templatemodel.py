import os
import nbformat
import shutil

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

    def delete_template(self, name):
        shutil.rmtree(os.path.join('templates', name))

    def get_templates(self):
        templatefolders = os.listdir('templates')
        templates = []
        for templatefolder in templatefolders:
            templates.append({
                'name': templatefolder,
                'link': os.path.join('tree', 'templates', templatefolder)
            })
        
        return templates