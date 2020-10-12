{%- extends 'base.tpl' -%}

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
  
{%- endblock -%}

{%- block breadcrumbs -%}
  {{ super() }}
  <li>/ <a href="{{ base_url }}/grader/assignments">Assignments</a></li>
  <li>/ <a href="{{ base_url }}/grader/assignment/{{ assignment_name }}">{{ assignment_name }}</a></li>
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