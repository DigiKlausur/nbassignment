import os
import nbformat
import shutil

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

    def delete_task(self, name):
        shutil.rmtree(os.path.join('tasks', name))
    
    def get_task_info(self, task):
        notebooks = [file for file in os.listdir(os.path.join('tasks', task)) if file.endswith('.ipynb')]

        points = 0
        questions = 0

        for notebook in notebooks:
            nb = nbformat.read(os.path.join('tasks', task, notebook), as_version=4)
            for cell in nb.cells:
                if 'nbgrader' in cell.metadata and cell.metadata.nbgrader.grade:
                    points += cell.metadata.nbgrader.points
                    questions += 1
        return points, questions
    
    def get_tasks(self):
        taskfolders = os.listdir('tasks')
        tasks = []
        for taskfolder in taskfolders:
            points, questions = self.get_task_info(taskfolder)
            tasks.append({
                'name': taskfolder,
                'points': points,
                'questions': questions,
                'link': os.path.join('tree', 'tasks', taskfolder)
            })
        
        return tasks