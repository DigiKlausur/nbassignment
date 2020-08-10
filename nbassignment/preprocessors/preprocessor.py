from traitlets.config import LoggingConfigurable

class Preprocessor(LoggingConfigurable):

    def preprocess(self, tasks, resources):
        for task in tasks:
            self.preprocess_task(task, resources)
        return tasks, resources

    def preprocess_task(self, task, resources):
        return task, resources