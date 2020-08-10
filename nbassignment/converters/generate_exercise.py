from traitlets.config import LoggingConfigurable
from traitlets import Unicode
import nbformat
import os

class GenerateExercise(LoggingConfigurable):

    template_path = Unicode('templates')
    task_path = Unicode('pools')

    def get_cell_type(self, cell):
        if ('nbassignment' in cell.metadata) and ('type' in cell.metadata.nbassignment):
            return cell.metadata.nbassignment.type
        return None

    def generate(self, assignment, name, template, tasks):
        exercise = nbformat.v4.new_notebook()

        template_nb = nbformat.read(
            os.path.join(self.template_path, template, '{}.ipynb'.format(template)),
            as_version=4)

        header = [cell for cell in template_nb.cells \
                  if self.get_cell_type(cell) in ['header', 'student_info', 'group_info']]
        footer = [cell for cell in template_nb.cells \
                  if self.get_cell_type(cell) == 'footer']

        exercise.cells.extend(header)

        for task in tasks:
            notebooks = [file for file in os.listdir(os.path.join(self.task_path, task)) if file.endswith('.ipynb')]
            for notebook in notebooks:
                task_nb = nbformat.read(os.path.join(self.task_path, task, notebook), as_version=4)
                exercise.cells.extend(task_nb.cells)

        exercise.cells.extend(footer)

        nbformat.write(exercise, os.path.join('source', assignment, '{}.ipynb'.format(name)))
