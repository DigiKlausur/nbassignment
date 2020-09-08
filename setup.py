#!/usr/bin/env python

import os
from setuptools import setup, find_packages

# get paths to all the extension files
extension_files = []
for (dirname, dirnames, filenames) in os.walk("nbassignment/nbextensions"):
    root = os.path.relpath(dirname, "nbassignment")
    for filename in filenames:
        if filename.endswith(".pyc"):
            continue
        extension_files.append(os.path.join(root, filename))

static_files = []
for (dirname, dirnames, filenames) in os.walk("nbassignment/server_extensions/taskcreator/static"):
    root = os.path.relpath(dirname, "nbassignment/server_extensions/taskcreator")
    for filename in filenames:
        static_files.append(os.path.join(root, filename))
for (dirname, dirnames, filenames) in os.walk("nbassignment/server_extensions/taskcreator/templates"):
    root = os.path.relpath(dirname, "nbassignment/server_extensions/taskcreator")
    for filename in filenames:
        static_files.append(os.path.join(root, filename))
for (dirname, dirnames, filenames) in os.walk("nbassignment/server_extensions/taskcreator/presets"):
    root = os.path.relpath(dirname, "nbassignment/server_extensions/taskcreator")
    for filename in filenames:
        static_files.append(os.path.join(root, filename))

name = u'nbassignment'

setup_args = dict(
    name=name,
    version='0.0.1',
    description='A system for creating assignments',
    author='Tim Metzler',
    author_email='tim.metzler@h-brs.de',
    license='MIT',
    url='https://github.com/DigiKlausur/nbassignment',
    keywords=['Notebooks', 'Grading', 'Homework'],
    classifiers=[
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
    ],
    packages=find_packages(),
    package_data={
        'nbassignment': extension_files,
        'nbassignment.server_extensions.taskcreator': static_files,
    },
    install_requires=[
        "jupyter",
        "notebook>=4.2",
        "nbconvert>=5.6",
        "nbformat",
        "traitlets",
        "jupyter_core",
        "jupyter_client",
        "tornado",
        "requests",
        "nbgrader"
    ]
)

if __name__ == "__main__":
    setup(**setup_args)