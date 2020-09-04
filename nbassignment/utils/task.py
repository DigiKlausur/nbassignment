def is_solution(cell):
    return 'nbgrader' in cell.metadata and cell.metadata.nbgrader.solution

def is_grade(cell):
    return 'nbgrader' in cell.metadata and cell.metadata.nbgrader.grade

def is_description(cell):
    return 'nbgrader' in cell.metadata and cell.metadata.nbgrader.locked \
            and not is_grade(cell)

def get_points(cell):
    meta = cell.metadata
    if 'nbgrader' in meta and 'points' in meta.nbgrader:
        return meta.nbgrader.points
    return 0

def get_task_info(nb):
    subtasks = []
    subtask = []
    for idx, cell in enumerate(nb.cells):
        subtask.append(idx)
        if is_grade(cell):
            subtasks.append(subtask)
            subtask = []
    task = dict()
    if len(subtasks) > 0 and len(subtasks[0]) > 0 and is_description(nb.cells[subtasks[0][0]]):
        task['header'] = subtasks[0].pop(0)
    task['subtasks'] = subtasks
    if len(subtask) > 0:
        task['other'] = subtask
    return task

def get_valid_name(name):
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    others = '01234567890_-'
    invalid = ''
    # Make sure at least one character is present
    if not any(char in chars for char in name):
        name = 'Task_{}'.format(name)
    # Identify and replace invalid chars
    for char in name:
        if char not in chars + others:
            invalid += char
    for char in invalid:
        name = name.replace(char, '_')
    return name