import os
import nbformat
from .preprocessor import Preprocessor

class MakeExercise(Preprocessor):
    
    def get_cell_type(self, cell):
        if ('nbassignment' in cell.metadata) and ('type' in cell.metadata.nbassignment):
            return cell.metadata.nbassignment.type    
   
    def preprocess(self, resources):
        exercise = nbformat.v4.new_notebook()
        template_path = os.path.join(
            resources['tmp_dir'],
            'template',
            resources['template'],
            '{}.ipynb'.format(resources['template'])
        )
        
        template_nb = nbformat.read(template_path, as_version=4)        
        header = [cell for cell in template_nb.cells \
                      if self.get_cell_type(cell) in ['header', 'student_info', 'group_info']]
        footer = [cell for cell in template_nb.cells \
                  if self.get_cell_type(cell) == 'footer']
        
        exercise.cells.extend(header)
        
        for task in resources['tasks']:
            task_path = os.path.join(
                resources['tmp_dir'],
                'tasks',
                task
            )
            notebooks = [file for file in os.listdir(task_path) \
                         if file.endswith('.ipynb')]
            for notebook in notebooks:
                task_nb = nbformat.read(os.path.join(task_path, notebook),
                                        as_version=4)
                exercise.cells.extend(task_nb.cells)
                
        exercise.cells.extend(footer)
        
        nbformat.write(exercise, os.path.join(
            resources['course_prefix'],
            resources['source_dir'],
            resources['assignment'],
            '{}.ipynb'.format(resources['exercise'])
        ))