import os
import glob
from .basemodel import BaseModel
from traitlets import Unicode


class AssignmentModel(BaseModel):

    directory = Unicode(
        'source',
        help='The directory where assignments go.'
    )

    def __init__(self, course_prefix):
        super().__init__(course_prefix)

    def __get_assignment_info(self, assignment):
        return len(glob.glob(os.path.join(self.base_path(), assignment, '*.ipynb')))

    def list(self):
        if not os.path.isdir(self.base_path()):
            os.makedirs(self.base_path(), exist_ok=True)
        assignmentfolders = os.listdir(self.base_path())
        assignments = []
        for assignmentfolder in assignmentfolders:
            exercises = self.__get_assignment_info(assignmentfolder)
            assignments.append({
                'name': assignmentfolder,
                'exercises': exercises,
                'link': os.path.join('taskcreator', 'assignments', assignmentfolder)
            })
        
        return assignments