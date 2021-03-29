import re
import os

class MarkdownImageFinder:
    
    def __init__(self):
        self.__p_inline = re.compile(r'!\[[^\]]*\]\(([^\)]*)\)')
        self.__p_html = re.compile(r'<img[^>]*src\s*=\s*("[^"]*"|\'[^\']*\')')
        self.__p_alt = re.compile(r'!\[[^\]]*\](\[[^\)\n]*\])')
        
    def __find_inline_images(self, markdown):
        return [find for find in self.__p_inline.findall(markdown)\
                if not find.startswith('attachment:')]
    
    def __find_html_images(self, markdown):
        return [find[1:][:-1]  for find in self.__p_html.findall(markdown)]
    
    def __find_alt_images(self, markdown):
        finds = []
        for link in self.__p_alt.findall(markdown):
            # Search for the alt link
            for line in markdown.split('\n'):
                if line.strip().startswith(link) and ':' in line:
                    finds.append(line.split(':')[-1].strip())
        return finds
    
    def find_images(self, markdown):
        return self.__find_inline_images(markdown) + \
               self.__find_html_images(markdown) + \
               self.__find_alt_images(markdown)
    
class CodeFileFinder:
    
    def __init__(self):
        self.__directory = r'[\w-]+'
        self.__slash = r'(/|\\)'
        
    def __get_pattern(self, filename):
        return re.compile(r'["\'](({}{})*{})["\']'.format(
            self.__directory, self.__slash, filename
        ))
                          
    def find_file(self, string, filename):
        return [f[0] for f in self.__get_pattern(filename).findall(string)]
    
class NotebookFileFinder:
    
    def __init__(self):
        self.__mdfinder = MarkdownImageFinder()
        self.__codefinder = CodeFileFinder()
        
    def flatten(self, iterable):
        return [item for sublist in iterable for item in sublist]
        
    def find_files_in_notebook(self, nb, files):
        finds = set()
        # Split into markdown and code cells
        markdown = [cell.source for cell in nb.cells if cell.cell_type == 'markdown']
        code = [cell.source for cell in nb.cells if cell.cell_type == 'code']
        # Find images in markdown cells
        markdown_finds = self.flatten(
            [self.__mdfinder.find_images(cell) for cell in markdown]
        )
        # Find files in code cells
        code_finds = []
        for other_file in files:
            name = os.path.basename(other_file)
            code_finds.extend(self.flatten(
                [self.__codefinder.find_file(cell, name) for cell in code]
            ))
            for find in markdown_finds:
                if name in find:
                    finds.add(find)
        code_finds = set(code_finds)
        return finds.union(code_finds)  
