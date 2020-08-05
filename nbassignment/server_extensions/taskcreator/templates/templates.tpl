{%- extends 'base.tpl' -%}

{% block head %}
<script type="module">    
    import addTemplateTable from "{{ base_url }}/taskcreator/static/js/templates.js";
    addTemplateTable({{ templates }});
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

{% endblock body %}

