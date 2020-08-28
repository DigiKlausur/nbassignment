import os
import shutil
from .preprocessor import Preprocessor

class CopyNotebooks(Preprocessor):
    
    def preprocess(self, resources):
        for task in resources['tasks']:
            src = os.path.join(self.task_path, task)
            dst = os.path.join(resources['tmp_dir'], 'tasks', task)
            shutil.copytree(src, dst)
        src = os.path.join(self.template_path, resources['template'])
        dst = os.path.join(resources['tmp_dir'], 'template', resources['template'])
        shutil.copytree(src, dst)
        return resources