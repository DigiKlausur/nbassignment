from traitlets.config import LoggingConfigurable
from ..config import ConfigManager

class BaseModel(LoggingConfigurable):

    def __init__(self):
        self.config = ConfigManager().get_config()