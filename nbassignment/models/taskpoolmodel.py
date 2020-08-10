import os
import nbformat
import shutil

class TaskPoolModel:

    def new(self, name):
        path = os.path.join('pools', name)
        os.makedirs(path, exist_ok=True)
        url = os.path.join('/', 'taskcreator', 'pools', name)
        return url

    def remove(self, name):
        shutil.rmtree(os.path.join('pools', name))
    
    def list(self):
        if not os.path.isdir('pools'):
            os.makedirs('pools', exist_ok=True)
        poolfolders = os.listdir('pools')
        pools = []
        for poolfolder in poolfolders:
            tasks = self.__get_pool_info(poolfolder)
            pools.append({
                'name': poolfolder,
                'tasks': tasks,
                'link': os.path.join('taskcreator', 'pools', poolfolder)
            })
        
        return pools

    def __get_pool_info(self, name):
        return len(os.listdir(os.path.join('pools', name)))