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
<div class='breadcrumbs'>
<ul>
    <li><a href="{{ base_url }}/taskcreator/pools">Task Pools</a></li>
</ul>
</div>

<div class='help'>
<h3>Manage task pools</h3>
<p>Task pools are collections of tasks about the same topic. A task consists of a collection of questions.</p>
</div>

{% endblock body %}
