import os
import glob


class ExerciseModel:

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