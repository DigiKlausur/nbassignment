import nbformat
import glob
import os
from .preprocessor import Preprocessor

class GenerateTaskIDs(Preprocessor):
    
    def is_solution(self, cell):
        return 'nbgrader' in cell.metadata and cell.metadata.nbgrader.solution
    
    def is_grade(self, cell):
        return 'nbgrader' in cell.metadata and cell.metadata.nbgrader.grade
    
    def is_description(self, cell):
        return 'nbgrader' in cell.metadata and cell.metadata.nbgrader.locked \
                and not self.is_grade(cell)
    
    def get_valid_name(self, name):
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        others = '01234567890_-'
        invalid = ''
        # Make sure at least one character is present
        if not any(char in chars for char in name):
            name = 'Task_{}'.format(name)
        # Identify and replace invalid chars
        for char in name:
            if char not in chars + others:
                invalid += char
        for char in invalid:
            name = name.replace(char, '_')
        return name
    
    def get_groups(self, nb):
        splits = [0]
        for cell_idx, cell in enumerate(nb.cells):
            if self.is_description(cell):
                # Description cell
                # Check if previous cell is test or solution
                if cell_idx > 0:
                    previous_cell = nb.cells[cell_idx - 1]
                    if self.is_grade(previous_cell):
                        splits.append(cell_idx)
        groups = []
        for idx, split in enumerate(splits):
            if idx + 1 < len(splits):
                groups.append(nb.cells[split:splits[idx + 1]])
            else:
                groups.append(nb.cells[split:])
        return groups
        
    
    def get_solution_cells(self, nb):
        solution_cells = []
        for idx, cell in enumerate(nb.cells):
            if 'nbgrader' in cell.metadata and cell.metadata.nbgrader.solution:
                solution_cells.append(idx)
        return solution_cells
    
    def generate_ids(self, nb, name):
        groups = self.get_groups(nb)
        # Check if notebook starts with a description
        header = None
        if self.is_description(groups[0][0]):
            header = groups[0][0]
            groups[0] = groups[0][1:]
            
        ids = ''
        suffix = ord('A')
        
        for group in groups:
            group_id = '{}_{}'.format(name, chr(suffix))
            ids += group_id
            suffix += 1
            tests = 0
            headers = 0
            for cell in group:
                if self.is_description(cell):
                    cell.metadata.nbgrader.grade_id = '{}_Description{}'.format(group_id, headers)
                    headers += 1
                elif self.is_solution(cell):
                    cell.metadata.nbgrader.grade_id = group_id
                elif self.is_grade(cell):
                    cell.metadata.nbgrader.grade_id = 'test_{}{}'.format(group_id, tests)
                    tests += 1
                    
        if header:
            header.metadata.nbgrader.grade_id = '{}_Header'.format(ids)
                    
        return nb
    
    def preprocess(self, resources):
        for task in resources['tasks']:
            task_path = os.path.join(
                resources['tmp_dir'],
                'tasks',
                task
            )
            nb_files = glob.glob(os.path.join(task_path, '*.ipynb'))
            for nb_file in nb_files:
                nb = nbformat.read(nb_file, as_version=4)
                name = os.path.splitext(os.path.basename(nb_file))[0]
                name = self.get_valid_name(name)
                self.generate_ids(nb, name)
                nbformat.write(nb, nb_file)