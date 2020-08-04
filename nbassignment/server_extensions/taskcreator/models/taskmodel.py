import os
import nbformat

class TaskModel:

    def __init__(self):
        pass

    def new_task(self, name):
        os.makedirs(os.path.join('tasks', name, 'img'), exist_ok=True)
        os.makedirs(os.path.join('tasks', name, 'data'), exist_ok=True)
        filename = '{}.ipynb'.format(name)
        nb = nbformat.v4.new_notebook()
        nb.metadata['nbassignment'] = {
            'type': 'task'
        }
        path = os.path.join('tasks', name, filename)
        nbformat.write(nb, path)
        url = os.path.join('/', 'notebooks', 'tasks', name, filename)

        return url

