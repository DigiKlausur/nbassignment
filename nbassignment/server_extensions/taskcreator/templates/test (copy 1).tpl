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
    <style type="text/css">
        #page {
  margin: auto;
  margin-top: 3em;
  width: 50%;
}

.option {
  border: 1px solid #ddd;
  border-radius: .5em;
  width: 20em;
  padding: 1em;
  margin-bottom: 1em;
  display: flex;
}

.icon {
  display: inline;
  margin-left: -1em;
}
.option h3 {
  display:  inline;
 
}

.option svg {
  min-width: 2em;
  font-size: 3em;
}

.option:hover {
  background-color: #eee;
}

#exercises .icon svg {
  color: green;
}

#pools .icon svg {
  color: orange;
}
    </style>

    {%- block head -%}
    {%- endblock -%}

</head>
<body>
    <div id="page">
        <div id="header">
            <h1>Nbassignment</h1>
        </div>
        <div id="body">
            <div class="option" id="exercises">
                <div class='icon'><i class='fa fa-file-alt'></i></div>
                <div class='label'><h3>Exercises</h3></div>
            </div>
            <div class="option" id="pools">
                <div class='icon'>
                    <i class='fa fa-folder'></i></div>
                    <div class='label'><h3>Task Pools</h3></div>
            </div>
            <div class="option" id="templates">
                <div class='icon'>
                    <i class='fa fa-clipboard-list'></i></div>
                    <div class='label'><h3>Templates</h3></div>
            </div>
        </div>
    </div>
</body>