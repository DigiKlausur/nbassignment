<!doctype html>
<head>
    <title>nbassignment</title>

    <script src="{{ base_url }}/taskcreator/static/components/jquery/jquery.min.js"></script>
    <script src="{{ base_url }}/taskcreator/static/components/fontawesome/js/all.min.js"></script>
    <script src="{{ base_url }}/taskcreator/static/components/requirejs/require.js"></script>
    <script type="text/javascript">
        require.config({
            baseUrl: 'static',
            paths: {
                jquery: 'components/jquery/jquery.min'
            }
        })
    </script>
    <link rel="stylesheet" href="{{ base_url }}/taskcreator/static/css/taskcreator.css" type="text/css">
    <link rel="stylesheet" href="{{ base_url }}/taskcreator/static/css/sidebar.css" type="text/css">
    

    {%- block head -%}
    {%- endblock -%}

</head>

<body>
    <div class="sidebar">
    {%- block sidebar -%}
    <h3>nbassignment</h3>
    <a href="{{ base_url }}/taskcreator/tasks" id="task-link">Manage Tasks</a>
    <a href="{{ base_url }}/taskcreator/templates" id="template-link">Manage Templates</a>
    {%- endblock -%}
    </div>
    <div class="body">
    {%- block body -%}
    {%- endblock -%}
    </div>
</body>