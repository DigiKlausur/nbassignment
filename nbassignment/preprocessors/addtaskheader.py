import os
import nbformat
from textwrap import dedent
from .preprocessor import Preprocessor

class AddTaskHeader(Preprocessor):
    
    def get_header(self, idx, points):
        header = nbformat.v4.new_markdown_cell()
        header.metadata['nbgrader'] = {
            'grade_id': 'taskheader_{}'.format(idx),
            'locked': True,
            'solution': False,
            'grade': False,
            'task': False,
            'schema_version': 3
        }
        header.source = dedent("""
        ---

        # Task {}

        **[{} Point(s)]**
        """.format(idx, points))
        return header
    
    def get_sub_header(self, idx, sub_idx, points):
        header = nbformat.v4.new_markdown_cell()
        header.metadata['nbgrader'] = {
            'grade_id': 'taskheader_{}_{}'.format(idx, sub_idx),
            'locked': True,
            'solution': False,
            'grade': False,
            'task': False,
            'schema_version': 3
        }
        header.source = dedent("""
        ## Task {}.{}

        **[{} Point(s)]**
        """.format(idx, sub_idx, points))
        return header
    
    def is_description(self, cell):
        return 'nbgrader' in cell.metadata and cell.metadata.nbgrader.grade_id.endswith('_Description0')
    
    def get_points(self, cell):
        meta = cell.metadata
        if 'nbgrader' in meta and 'points' in meta.nbgrader:
            return meta.nbgrader.points
        return 0
    
    def get_total_points(self, task_nb):
        total = 0
        for cell in task_nb.cells:
            total += self.get_points(cell)
        return total
    
    def add_sub_headers(self, task_id, task_nb):
        splits = []
        for idx, cell in enumerate(task_nb.cells):
            if self.is_description(cell):
                splits.append(idx)

        splits.append(len(task_nb.cells))

        task_positions = []

        for i in range(len(splits) - 1):
            points = 0
            for cell in task_nb.cells[splits[i]:splits[i+1]]:
                points += self.get_points(cell)
            task_positions.append((splits[i], points))

        sub_idx = 0
        for task_position in task_positions:
            header = self.get_sub_header(task_id, sub_idx + 1, task_position[1])
            task_nb.cells = task_nb.cells[:task_position[0] + sub_idx] + \
                            [header] + \
                            task_nb.cells[sub_idx + task_position[0]:]
            sub_idx += 1

        return task_nb
    
    def preprocess(self, resources):
        idx = 0
        for task in resources['tasks']:
            task_path = os.path.join(
                resources['tmp_dir'],
                'tasks',
                task
            )
            notebooks = [file for file in os.listdir(task_path) \
                         if file.endswith('.ipynb')]
            for nb_file in notebooks:
                idx += 1
                task_nb = nbformat.read(os.path.join(task_path, nb_file),
                                        as_version=4)
                header = self.get_header(idx, self.get_total_points(task_nb))
                task_nb.cells = [header] + task_nb.cells
                task_nb = self.add_sub_headers(idx, task_nb)
                nbformat.write(task_nb, os.path.join(task_path, nb_file))