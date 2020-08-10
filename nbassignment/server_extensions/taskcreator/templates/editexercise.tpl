{%- extends 'base.tpl' -%}

{% block head %}
<link rel="stylesheet" href="{{ base_url }}/taskcreator/static/css/editexercise.css" type="text/css">
<script type="module">    
    import {addTaskSelector, generateExercise} from "{{ base_url }}/taskcreator/static/js/editexercise.js";
    addTaskSelector({{ pools }});
    generateExercise("{{ exercise }}", "{{ assignment }}");
</script>
{% endblock head %}

{% block sidebar %}
{{ super() }}
<script type="text/javascript">
    $('#exercise-link').addClass("active");
</script>
{% endblock sidebar %}

{% block body %}

<h1>Edit Exercise - {{ exercise }}</h1>
<div class='breadcrumbs'>
<ul>
    <li><a href="{{ base_url }}/taskcreator/assignments">Assignments</a></li>
    <li> > <a href="{{ base_url }}/taskcreator/assignments/{{ assignment }}">{{ assignment }}</a></li>
    <li> > {{ exercise }}</li>
</ul>
</div>

<div>
    <div id="template-select">
        <h3>1. Template</h3>
        <label for="template">Choose a template:</label>
        <select name="template" id="template">
            {% for template in templates %}
                <option value="{{ template.name }}">{{ template.name }}</option>
            {% endfor %}
        </select>
    </div>
    <div id="task-select">
        <h3>2. Tasks</h3>
    </div>
    <div id="generate">
        <h3>3. Generate Exercise</h3>
    </div>
</div>


{% endblock body %}