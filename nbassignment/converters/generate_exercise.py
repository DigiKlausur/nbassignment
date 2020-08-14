from traitlets.config import LoggingConfigurable
from traitlets import Unicode
from .prepare_template import NotebookVariableReplacer
from ..utils import CopyAdditionalFiles
import nbformat
import os
import tempfile
import shutil
import glob

class GenerateExercise(LoggingConfigurable):

    template_path = Unicode('templates')
    task_path = Unicode('pools')

    def get_cell_type(self, cell):
        if ('nbassignment' in cell.metadata) and ('type' in cell.metadata.nbassignment):
            return cell.metadata.nbassignment.type
        return None

    def generate(self, assignment, name, template, tasks, template_options):
        exercise_path = os.path.join('source', assignment)
        shutil.rmtree(os.path.join(exercise_path, name + '_files'), ignore_errors=True)
        with tempfile.TemporaryDirectory() as tmp:
            task_tmp = os.path.join(tmp, 'tasks')
            template_tmp = os.path.join(tmp, 'templates')
            for task in tasks:
                taskname = os.path.split(task)[-1]
                dst = os.path.join(task_tmp, taskname)
                shutil.copytree(os.path.join(self.task_path, task), dst)
            shutil.copytree(os.path.join(self.template_path, template), os.path.join(template_tmp, template))
            folders = glob.glob(os.path.join(template_tmp, '*')) \
                    + glob.glob(os.path.join(task_tmp, '*'))
            CopyAdditionalFiles().copyfiles(name+'_files', folders, exercise_path)
            
            exercise = nbformat.v4.new_notebook()

            template_path = os.path.join(template_tmp, template, '{}.ipynb'.format(template))

            template_nb =  NotebookVariableReplacer().replace(template_path, template_options)

            header = [cell for cell in template_nb.cells \
                      if self.get_cell_type(cell) in ['header', 'student_info', 'group_info']]
            footer = [cell for cell in template_nb.cells \
                      if self.get_cell_type(cell) == 'footer']

            exercise.cells.extend(header)
            
            for task in tasks:
                taskname = os.path.split(task)[-1]
                notebooks = [file for file in os.listdir(os.path.join(task_tmp, taskname)) \
                             if file.endswith('.ipynb')]
                for notebook in notebooks:
                    task_nb = nbformat.read(os.path.join(task_tmp, taskname, notebook), as_version=4)
                    exercise.cells.extend(task_nb.cells)

            exercise.cells.extend(footer)

            nbformat.write(exercise, os.path.join(exercise_path, '{}.ipynb'.format(name)))
            
        return