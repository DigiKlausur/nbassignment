import os
from copy import deepcopy

from traitlets.config import Config
from traitlets.config.loader import PyFileConfigLoader
from traitlets.config.manager import recursive_update
from jupyter_core.paths import jupyter_config_path

class ConfigManager:
    
    config_name = 'nbassignment_config'
    
    def recursive_update(self, target, new):
        for key in new:
            target[key] = deepcopy(new[key])
        return target
        
    
    def get_config(self):
        cfg = Config()
        for config_path in jupyter_config_path():
            path = os.path.join(config_path, '{}.py'.format(self.config_name))
            if os.path.isfile(path):
                self.recursive_update(cfg, PyFileConfigLoader(path).load_config())
        return cfg