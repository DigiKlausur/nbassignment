{%- extends 'base.tpl' -%}

{% block head %}
<script type="module">    
    import addTemplateTable from "{{ base_url }}/taskcreator/static/js/templates.js";
    addTemplateTable({{ templates }}, {{ base_url }});
</script>
{% endblock head %}

{% block sidebar %}
{{ super() }}
<script type="text/javascript">
    $('#template-link').addClass("active");
</script>
{% endblock sidebar %}

{% block body %}
<h1>Templates</h1>
<div class='breadcrumbs'>
<ul>
    <li><a href="{{ base_url }}/taskcreator/templates">Templates</a></li>
</ul>
</div>

<div class='help'>
<h3>Create templates</h3>
<p>Templates are used for creating exercises. A template consists of header and footer cells and special cells like student info.
You can use variables in templates by enclosing them in double curly braces <span style="white-space:nowrap">(e.g. <strong>&#123;&#123; my_var &#125;&#125;</strong>).</span> 
When creating an exercise you can set the values for those variables.</p>
</div>

{% endblock body %}

