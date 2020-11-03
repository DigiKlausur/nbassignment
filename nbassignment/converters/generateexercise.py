import tempfile
from traitlets import List
from .converter import Converter
from ..preprocessors import (
    RemoveExercise, CopyNotebooks, FillTemplate, CopyFiles,
    GenerateTaskIDs, AddTaskHeader, MakeExercise)

class GenerateExercise(Converter):

    preprocessors = List([
        RemoveExercise,
        CopyNotebooks,
        FillTemplate,
        CopyFiles,
        GenerateTaskIDs,
        AddTaskHeader,
        MakeExercise
    ])

    def __init__(self, config=None, course_prefix='', source_dir='source'):
        super(GenerateExercise, self).__init__(config=config)
        self.course_prefix = course_prefix
        self.source_dir = source_dir

    def convert(self, resources):
        with tempfile.TemporaryDirectory() as tmp:
            resources['tmp_dir'] = tmp
            resources['course_prefix'] = self.course_prefix
            resources['source_dir'] = self.source_dir
            for preprocessor in self._preprocessors:
                preprocessor.preprocess(resources)