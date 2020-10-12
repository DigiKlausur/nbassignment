{%- extends 'base.tpl' -%}

{%- block head -%}
  {{super()}}

  <script type="text/javascript">
    $.ajax({
      url: "{{ base_url }}/grader/api/pools/{{ pool }}",
      type: 'get',
      success: function (response) {
        console.log(response);
        console.log($.parseJSON(response));
        let tasks = $.parseJSON(response);
        let table = $('<table/>');
        table
          .addClass('e2xtable')
          .append(
            $('<thead/>').append(
              $('<tr/>')
                .append($('<th/>').text('Name'))
                .append($('<th/>').text('# of Questions'))
                .append($('<th/>').text('Points'))
                .append($('<th/>').text('Edit'))
                .append($('<th/>').text('Delete'))
        ));
        let body = $('<tbody/>');
        tasks.forEach(function (task) {
          body.append(
            $('<tr/>')
              .append($('<td/>').append($('<a/>')
                .attr('href', '/' + task['link'] + '/' + task['name'] + '.ipynb')
                .attr('target', '_blank')
                .text(task['name'])))
              //.append($('<td/>').text(task['name']))
              .append($('<td/>').text(task['questions']))
              .append($('<td/>').text(task['points']))
              .append($('<td/>').text(task['link']))
              .append($('<td/>').text('Delete'))
          );
        });

        $('#table').append(table.append(body));
      },
      error: function (xhr) {
        console.log('Something went wrong when fetching the task infos');
      }
    });
  </script>
  
{%- endblock -%}

{%- block breadcrumbs -%}
  {{ super() }}
  <li>/ <a href="{{ base_url }}/grader/pools">Question Pools</a></li>
  <li>/ <a href="{{ base_url }}/grader/pools/{{ pool }}">{{ pool }}</a></li>
{%- endblock -%}
{%- block body -%}
  <div id="table"></div>
  <div class="option" id="options">
    <div class='icon'><i class='fa fa-plus'></i></div>
    <div class='label'>
      <h3>Add Question</h3>
    </div>
  </div>
{%- endblock -%}