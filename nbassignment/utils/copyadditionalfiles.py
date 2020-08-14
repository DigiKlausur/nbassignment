import os
import glob
import shutil
import filecmp
import nbformat

class CopyAdditionalFiles:
    
    def rename(self, task, old_name, new_name):
        old_file_name = os.path.split(old_name)[1]
        new_file_name = os.path.split(new_name)[1]
        for nb_file in glob.glob(os.path.join(task, '*.ipynb')):
            nb = nbformat.read(nb_file, as_version=4)
            for cell in nb.cells:
                cell.source = cell.source.replace(old_name, new_name)
                if old_file_name != new_file_name:
                    cell.source = cell.source.replace(old_file_name, new_file_name)
            nbformat.write(nb, nb_file)
    
    def get_new_name(self, file, dst):
        suffix = 1
        name, extension = os.path.splitext(file)
        new_name = '{}_{}{}'.format(name, suffix, extension)
        while os.path.exists(os.path.join(dst, new_name)):
            suffix += 1
            new_name = '{}_{}{}'.format(name, suffix, extension)
        return new_name
    
    def get_files(self, task):
        finds = []
        for subdir in ['img', 'data']:
            for root, dirs, files in os.walk(os.path.join(task, subdir)):
                dirs[:] = [d for d in dirs if d not in ['.ipynb_checkpoints']]
                for file in files:
                    finds.append(os.path.relpath(os.path.join(root, file), task))
        return finds
    
    def copyfile(self, src, dst):
        if os.path.exists(dst):
            return filecmp.cmp(src, dst)
        dirs = os.path.split(dst)[0]
        os.makedirs(dirs, exist_ok=True)
        shutil.copyfile(src, dst)
        return True
    
    def copyfiles(self, exercise, tasks, dst):
        dst = os.path.join(dst, exercise)
        for task in tasks:
            files = self.get_files(task)
            for file in files:
                src_file = os.path.join(task, file)
                dst_file = os.path.join(dst, file)
                new_name = os.path.join(exercise, file)
                if not self.copyfile(src_file, dst_file):
                    # Conflicting file names
                    renamed = self.get_new_name(file, dst)
                    self.copyfile(src_file, os.path.join(dst, renamed))
                    new_name = os.path.join(exercise, renamed)
                # Rename in notebook
                self.rename(task, file, new_name)