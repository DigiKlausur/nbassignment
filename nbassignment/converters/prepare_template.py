import re
import nbformat

class NotebookVariableReplacer:
    
    def __init__(self):
        self.__pattern = re.compile(r'({{\s*(\w+)\s*}})')
        
    def replace(self, nb_path, replacements):
        nb = nbformat.read(nb_path, as_version=4)
        replaced = nbformat.v4.new_notebook()
        variables = []
        for cell in nb.cells:
            source = cell.source
            variables = self.__pattern.findall(source)
            new_cell = cell.copy()
            for variable in variables:
                new_cell.source = new_cell.source.replace(variable[0], replacements[variable[1]])
            replaced.cells.append(new_cell)
        return replaced