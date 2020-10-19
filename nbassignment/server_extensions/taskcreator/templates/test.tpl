<!doctype html>
<head>
    <title>nbassignment</title>
    {%- block head -%}

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
}

#body {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.option {
  border: 1px solid #ddd;
  border-radius: .5em;
  width: 20em;
  padding: 1em;
  margin-bottom: 2em;
  display: flex;
  margin-right: 2em;
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

svg {
  color: #aaa;
}

.option:hover {
  background-color: #eee;
  cursor: pointer;
}

#assignments svg {
  color: #008ffb;
}

#students svg {
  color: #ef474a;
}

#pools svg {
  color: #fdc006; 
}

#templates svg {
  color: #a2cf37;
}

#export svg {
  color: #995dea;
}

.label p {
    margin: 0;
}

#breadcrumbs ul {
  list-style: none;
  padding: 0;
}

#breadcrumbs li {
    display: inline;
}

    </style>
    
    {%- endblock -%}

</head>
<body>
    <div id="page">
        <div id="header">
            <h1>E²X Grader</h1>
            <div id="breadcrumbs">
                {%- block breadcrumbs -%}
                <ul>
                    <li><i class='fa fa-home'></i></li>
                    <li>><i class='fa fa-file-alt'></i>Assignments</li>
                </ul>
                {%- endblock -%}
            </div>
        </div>
        <div id="body">
            <div class="option" id="assignments" onclick="window.location='{{ base_url }}/formgrader/manage_assignments'">
                <div class='icon'><i class='fa fa-file-alt'></i></div>
                <div class='label'>
                    <h3>Assignments</h3>
                    <p>Create, grade, release and collect assignments</p>
                </div>
            </div>
            <div class="option" id="students" onclick="window.location='{{ base_url }}/formgrader/manage_students'">
                <div class='icon'><i class='fa fa-user-friends'></i></div>
                    <div class='label'>
                        <h3>Students</h3>
                        <p>Manage student information</p>
                    </div>
            </div>
            <div class="option" id="pools" onclick="window.location='{{ base_url }}/taskcreator/pools'">
                <div class='icon'><i class='fa fa-folder'></i></div>
                    <div class='label'>
                        <h3>Question Pools</h3>
                        <p>Add questions and manage pools</p>
                    </div>
            </div>
            <div class="option" id="templates" onclick="window.location='{{ base_url }}/taskcreator/templates'">
                <div class='icon'><i class='fa fa-clipboard-list'></i></div>
                    <div class='label'>
                        <h3>Templates</h3>
                        <p>Create and edit exercise templates</p>
                    </div>
            </div>
            <div class="option" id="export" onclick="window.location='{{ base_url }}/formgrader/export_grades'">
                <div class='icon'><i class='fa fa-download'></i></div>
                    <div class='label'>
                        <h3>Export</h3>
                        <p>Export grades as csv files</p>
                    </div>
            </div>
        </div>
    </div>
</body>