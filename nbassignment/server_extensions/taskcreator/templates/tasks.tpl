{%- extends 'base.tpl' -%}

{% block head %}
<script type="module">    
    import addTaskTable from "{{ base_url }}/taskcreator/static/js/tasks.js";
    addTaskTable({{ tasks }}, "{{ pool }}", "{{ base_url }}");
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
<div class='breadcrumbs'>
<ul>
    <li><a href="{{ base_url }}/taskcreator/pools">Task Pools</a></li>
    <li> > {{ pool }}</li>
</ul>
</div>


{% endblock body %}

