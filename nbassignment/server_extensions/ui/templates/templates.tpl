{%- extends 'base.tpl' -%}

{%- block head -%}
  {{super()}}

  <script type="text/javascript">
    $.ajax({
      url: "{{ base_url }}/grader/api/templates/",
      type: 'get',
      success: function (response) {
        console.log(response);
        console.log($.parseJSON(response));
        let templates = $.parseJSON(response);
        let table = $('<table/>');
        table
          .addClass('e2xtable')
          .append(
            $('<thead/>').append(
              $('<tr/>')
                .append($('<th/>').text('Name'))
                .append($('<th/>').text('Edit'))
                .append($('<th/>').text('Delete'))
        ));
        let body = $('<tbody/>');
        templates.forEach(function (template) {
          body.append(
            $('<tr/>')
              .append($('<td/>').text(template['name']))
              .append($('<td/>').text(template['link']))
              .append($('<td/>').text('Delete'))
          );
        });

        $('#table').append(table.append(body));
      },
      error: function (xhr) {
        console.log('Something went wrong when fetching the template infos');
      }
    });
  </script>
  
{%- endblock -%}

{%- block breadcrumbs -%}
  {{ super() }}
  <li>/ <a href="{{ base_url }}/grader/templates">Exercise Templates</a></li>
{%- endblock -%}
{%- block body -%}
  <div id="table"></div>
  <div class="option" id="options">
    <div class='icon'><i class='fa fa-plus'></i></div>
    <div class='label'>
      <h3>Add Template</h3>
    </div>
  </div>
{%- endblock -%}