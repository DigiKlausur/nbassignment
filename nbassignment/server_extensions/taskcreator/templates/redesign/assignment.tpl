{%- extends 'redesign/base.tpl' -%}

{%- block head -%}
  {{super()}}

  <script type="text/javascript">
    $.ajax({
      url: "{{ base_url }}/formgrader/api/assignment/{{ assignment_name }}",
      type: 'get',
      success: function (response) {
        console.log(response);
        console.log($.parseJSON(response));
        let data = $.parseJSON(response);
        let duedate = 'No due date set';
        if (data['duedate'] != null) {
          duedate = data['duedate'];
        }
        let table = $('<table/>');
        table
          .addClass('e2xtable')
          .append(
            $('<thead/>').append(
              $('<tr/>')
                .append($('<th/>').text('Assignment Details'))
                .append($('<th/>'))
            ))
          .append(
            $('<tbody/>')
              .append(
                $('<tr/>')
                  .append($('<td/>').text('Status'))
                  .append($('<td/>').text(data['status']))
              )
              .append(
                $('<tr/>')
                  .append($('<td/>').text('Submissions'))
                  .append($('<td/>').text(data['num_submissions']))
              )
              .append(
                $('<tr/>')
                  .append($('<td/>').text('Due date'))
                  .append($('<td/>').text(duedate))
              )
            );
        $('#assignment_info').append(table);
      },
      error: function (xhr) {
        console.log('Something went wrong when fetching the assignment data for {{ assignment_name }}');
      }
    });
  </script>

  <style type="text/css">
    #page {
      margin: auto;
      margin-top: 3em;
      padding: 1em;
      padding-bottom: 2em;
      box-shadow: 3px 3px 10px #ddd;
    }

    #header {
      margin-top: -2em;
    }

    #body {
      display: grid;
      grid-gap: 1em;
      grid-template-columns: 1fr 1fr;
    }

    .option {
      border: 1px solid #ddd;
      border-radius: .5em;
      width: 30em;
      padding: 1em;
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

    svg {
      color: #aaa;
    }

    .option:hover {
      background-color: #eee;
      cursor: pointer;
    }

    #options svg {
      color: #008ffb;
    }

    #notebooks svg {
      color: #ef474a;
    }

    #grading svg {
      color: #fdc006; 
    }

    #exchange svg {
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

    #breadcrumbs {
      background-color: #006fbf;
      padding: 0 .5em 0 .5em;
      line-height: 2em;
      border-radius: .25em;
      color: #fff;
    }

    #breadcrumbs svg {
      color: #fff;
    }

    #assignment_info {
      grid-column: 1 / span 2;
    }

    .e2xtable td:nth-child(1) {
      font-weight: bold;
    }

    .e2xtable thead th {
      background-color: #008ffb;
    }
  </style>    
{%- endblock -%}

{%- block pagetitle -%}
  {{ super() }}
  <h2>Assignment: {{ assignment_name }}</h2>
{%- endblock -%}
{%- block breadcrumbs -%}
  {{ super() }}
  <li>/ <a href="{{ base_url }}/taskcreator/test">Assignments</a></li>
  <li>/ <a href="{{ base_url }}/taskcreator/assignment/{{ assignment_name }}">{{ assignment_name }}</a></li>
{%- endblock -%}
{%- block body -%}
  <div id="assignment_info"></div>
  <div class="option" id="options">
    <div class='icon'><i class='fa fa-cog'></i></div>
    <div class='label'>
      <h3>Options</h3>
      <p>Edit name and due date</p>
    </div>
  </div>
  <div class="option" id="notebooks" onclick="window.location='{{ base_url }}/taskcreator/assignments/{{ assignment_name }}'">
    <div class='icon'><i class='fa fa-file-alt'></i></div>
    <div class='label'>
      <h3>Exercises</h3>
      <p>Create and edit exercise sheets</p>
    </div>
  </div>
  <div class="option" id="grading" onclick="window.location='{{ base_url }}/formgrader/gradebook/{{ assignment_name }}/?view=task'">
    <div class='icon'><i class='fa fa-chalkboard-teacher'></i></div>
    <div class='label'>
      <h3>Grading</h3>
      <p>Grade student submissions</p>
    </div>
  </div>
  <div class="option" id="exchange">
    <div class='icon'><i class='fa fa-exchange-alt'></i></div>
    <div class='label'>
      <h3>Exchange</h3>
      <p>Release assignment and collect submissions</p>
    </div>
  </div>
{%- endblock -%}