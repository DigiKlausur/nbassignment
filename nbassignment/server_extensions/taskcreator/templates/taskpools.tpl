{%- extends 'base.tpl' -%}

{% block head %}
<script type="module">    
    import addTaskPoolTable from "{{ base_url }}/taskcreator/static/js/taskpools.js";
    addTaskPoolTable({{ taskpools }});
</script>
{% endblock head %}

{% block sidebar %}
{{ super() }}
<script type="text/javascript">
    $('#task-link').addClass("active");
</script>
{% endblock sidebar %}

{% block body %}
<h1>Task Pools</h1>

{% endblock body %}
