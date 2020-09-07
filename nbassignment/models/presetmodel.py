from traitlets.config import LoggingConfigurable
from traitlets import Unicode
import os
import nbformat

class PresetModel(LoggingConfigurable):
    
    task_preset_path = Unicode(
        os.path.join(
            os.path.dirname(__file__),
            '..',
            '..',
            'nbassignment/server_extensions/taskcreator/presets/questions/'
        )
    ).tag(config=True)
    
    def list_question_presets(self):
        presets = []
        for item in os.listdir(self.task_preset_path):
            if os.path.isfile(os.path.join(self.task_preset_path, item)) and \
               item.endswith('.ipynb'):
                presets.append(os.path.splitext(item)[0])
        return presets
    
    def get_question_preset(self, preset_name):
        path = os.path.join(self.task_preset_path, '{}.ipynb'.format(preset_name))
        if os.path.isfile(path):
            nb = nbformat.read(path, as_version=4)
            return nb.cells    