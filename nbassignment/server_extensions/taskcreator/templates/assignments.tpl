{%- extends 'base.tpl' -%}

{% block head %}
<script type="module">
    import addAssignmentTable from "{{ base_url }}/taskcreator/static/js/assignments.js";
    addAssignmentTable({{ assignments }});    
</script>
{% endblock head %}

{% block sidebar %}
{{ super() }}
<script type="text/javascript">
    $('#exercise-link').addClass("active");
</script>
{% endblock sidebar %}

{% block body %}

<h1>Assignments</h1>
<div class='breadcrumbs'>
<ul>
    <li><a href="{{ base_url }}/taskcreator/assignments">Assignments</a></li>
</ul>
</div>

<div class='help'>
<h3>Choose your assignment</h3>
<p>Here you can choose which assignment you want to create an exercise for. An exercise is a single Jupyter Notebook consisting of tasks. Assignments have to be created via <a href="{{ base_url }}/formgrader/">nbgrader</a>.</p>
</div>


{% endblock body %}