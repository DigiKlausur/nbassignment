{%- extends 'base.tpl' -%}

{% block head %}
<script type="module">    
    import addExerciseTable from "{{ base_url }}/taskcreator/static/js/exercises.js";
    addExerciseTable({{ exercises }});
</script>
{% endblock head %}

{% block sidebar %}
{{ super() }}
<script type="text/javascript">
    $('#exercise-link').addClass("active");
</script>
{% endblock sidebar %}

{% block body %}

<h1>Exercises</h1>
<div class='breadcrumbs'>
<ul>
    <li><a href="{{ base_url }}/taskcreator/assignments">Assignments</a></li>
    <li> > {{ assignment }}</li>
</ul>
</div>


{% endblock body %}