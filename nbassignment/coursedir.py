from textwrap import dedent
from traitlets.config import LoggingConfigurable
from traitlets import Unicode
from nbgrader.apps import NbGrader
from nbgrader.coursedir import CourseDirectory as NbGraderCourseDirectory


class CourseDirectory(LoggingConfigurable):

    _instance = None

    def initialize(self):
        app = NbGrader()
        app.load_config_file()
        self.coursedir = NbGraderCourseDirectory()
        self.coursedir.config = app.config
        self.log.info('Loaded nbassignment coursedir')

    def __new__(cls):
        if not cls._instance:
            print('Creating new instance')
            cls._instance = super(CourseDirectory, cls).__new__(cls)
            cls._instance.initialize()
        return cls._instance

    def format_path(self, nbgrader_step: str, student_id: str, assignment_id: str, escape: bool = False) -> str:
        return self.coursedir.format_path(
            nbgrader_step=nbgrader_step,
            student_id=student_id,
            assignment_id=assignment_id,
            escape=escape
        )