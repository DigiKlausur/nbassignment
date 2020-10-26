from traitlets.config import LoggingConfigurable
from traitlets import Unicode
from ..config import ConfigManager
from ..coursedir import CourseDirectory

class BaseModel(LoggingConfigurable):

    directory = Unicode(
        '.',
        help='The directory of the model'
    )

    def __init__(self):
        self.config = ConfigManager().get_config()
        self.coursedir = CourseDirectory()

    def base_path(self):
        return self.coursedir.format_path(
                self.directory, '.', '.'
            )