import os
import glob


class AssignmentModel:

    def __get_assignment_info(self, assignment):
        return len(glob.glob(os.path.join('source', assignment, '*.ipynb')))


    def list(self):
        if not os.path.isdir('source'):
            os.makedirs('source', exist_ok=True)
        assignmentfolders = os.listdir('source')
        assignments = []
        for assignmentfolder in assignmentfolders:
            exercises = self.__get_assignment_info(assignmentfolder)
            assignments.append({
                'name': assignmentfolder,
                'exercises': exercises,
                'link': os.path.join('taskcreator', 'assignments', assignmentfolder)
            })
        
        return assignments