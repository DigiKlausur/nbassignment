import unittest
import os
import nbformat
from nbformat.v4 import new_notebook, new_markdown_cell
from textwrap import dedent
from nbassignment.utils import NotebookVariableExtractor

class TestNotebookVariableExtractor(unittest.TestCase):

    def setUp(self):
        nb = new_notebook()
        cell = new_markdown_cell()
        cell.source = dedent('''
            This is a {{ variable }}, this is {{variable2}}
            and of course there is {{    variable3}} and
            {{variable4   }}, as well as {{   variable5   }}

            It also works with {{ under_scores }},
            but not {{ like this }}
        ''')
        nb.cells.append(cell)
        self.notebook_file = 'test.ipynb'
        nbformat.write(nb, self.notebook_file)

    def test_extract_variables(self):
        extractor = NotebookVariableExtractor()
        variables = extractor.extract(self.notebook_file)
        for variable in ['variable', 'variable2', 'variable3', 'variable4', 'variable5', 'under_scores']:
            assert variable in variables
        assert len(variables) == 6

    def tearDown(self):
        if os.path.isfile(self.notebook_file):
            os.remove(self.notebook_file)