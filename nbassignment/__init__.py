"""
A system for creating assignments.
"""

import os
import sys


def _jupyter_nbextension_paths():
    paths = [
        dict(
            section="tree",
            src=os.path.join('nbextensions', 'taskcreator'),
            dest="taskcreator",
            require="taskcreator/main"
        ),
        dict(
            section="notebook",
            src=os.path.join('nbextensions', 'taskeditor'),
            dest="taskeditor",
            require="taskeditor/main"
        ),
        dict(
            section="notebook",
            src=os.path.join('nbextensions', 'templatebar'),
            dest="templatebar",
            require="templatebar/main"
        ),
    ]

    return paths


def _jupyter_server_extension_paths():
    paths = [
        dict(module="nbassignment.server_extensions.taskcreator"),
        dict(module="nbassignment.server_extensions.ui")
    ]

    return paths
