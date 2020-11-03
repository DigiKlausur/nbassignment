import os
from traitlets.config import LoggingConfigurable
from traitlets import Unicode

class BaseModel(LoggingConfigurable):

    directory = Unicode(
        '.',
        help='The directory of the model'
    )

    def __init__(self, course_prefix):
        self.course_prefix = course_prefix

    def base_path(self):
        return os.path.join(self.course_prefix, self.directory)