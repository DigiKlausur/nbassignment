import os
from .preprocessor import Preprocessor

class CopyFiles(Preprocessor):

    def __init__(self):
        super(CopyFiles, self).__init__()

    def preprocess(self, tasks, resources):
        dst_path = os.path.join('source', resources['assignment'])
        os.makedirs(os.path.join(dst_path, 'img'), exist_ok=True)
        os.makedirs(os.path.join(dst_path, 'data'), exist_ok=True)
        for task in tasks:
            self.preprocess_task(task, resources)

    def preprocess_task(self, task, resources):
        pass
        
        

