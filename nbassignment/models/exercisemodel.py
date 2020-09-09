import os
import glob
import shutil
from .basemodel import BaseModel

class ExerciseModel(BaseModel):

    def remove(self, assignment, name):
        base_path = os.path.join('source', assignment)
        exercise_files = os.path.join(base_path, '{}_files'.format(name))
        if os.path.exists(exercise_files):
            shutil.rmtree(exercise_files)
        exercise = os.path.join(base_path, '{}.ipynb'.format(name))
        if os.path.exists(exercise):
            os.remove(exercise)

    def list(self, assignment):
        base_path = os.path.join('source', assignment)
        exercisenbs = glob.glob(os.path.join(base_path, '*.ipynb'))
        exercises = []
        for exercisenb in exercisenbs:
            name = os.path.split(exercisenb)[-1].replace('.ipynb', '')
            exercises.append({
                'name': name,
                'link': os.path.join('taskcreator', 'assignments', assignment, name)
            })
        
        return exercises