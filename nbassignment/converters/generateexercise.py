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

    def __init__(self, config=None):
        super(GenerateExercise, self).__init__(config=config)

    def convert(self, resources):
        with tempfile.TemporaryDirectory() as tmp:
            resources['tmp_dir'] = tmp
            for preprocessor in self._preprocessors:
                preprocessor.preprocess(resources)