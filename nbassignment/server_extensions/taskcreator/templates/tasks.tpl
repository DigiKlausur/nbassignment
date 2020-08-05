{%- extends 'base.tpl' -%}

{% block head %}
<script type="module">    
    import addTaskTable from "{{ base_url }}/taskcreator/static/js/tasks.js";
    addTaskTable({{ tasks }});
</script>
{% endblock head %}

{% block sidebar %}
{{ super() }}
<script type="text/javascript">
    $('#task-link').addClass("active");
</script>
{% endblock sidebar %}

{% block body %}
<h1>Tasks</h1>

{% endblock body %}

