{%- extends 'base.tpl' -%}

{%- block head -%}
  {{super()}}

  <script type="text/javascript">
    $.ajax({
      url: "{{ base_url }}/grader/api/pools/",
      type: 'get',
      success: function (response) {
        console.log(response);
        console.log($.parseJSON(response));
        let pools = $.parseJSON(response);
        let table = $('<table/>');
        table
          .addClass('e2xtable')
          .append(
            $('<thead/>').append(
              $('<tr/>')
                .append($('<th/>').text('Name'))
                .append($('<th/>').text('# of Tasks'))
                .append($('<th/>').text('Edit'))
                .append($('<th/>').text('Delete'))
        ));
        let body = $('<tbody/>');
        pools.forEach(function (pool) {
          body.append(
            $('<tr/>')
              .append($('<td/>').append($('<a/>').attr('href', '{{ base_url }}/grader/pools/' + pool['name']).text(pool['name'])))
              .append($('<td/>').text(pool['tasks']))
              .append($('<td/>').text(pool['link']))
              .append($('<td/>').text('Delete'))
          );
        });

        $('#table').append(table.append(body));
      },
      error: function (xhr) {
        console.log('Something went wrong when fetching the pool infos');
      }
    });
  </script>
  
{%- endblock -%}

{%- block breadcrumbs -%}
  {{ super() }}
  <li>/ <a href="{{ base_url }}/grader/pools">Question Pools</a></li>
{%- endblock -%}
{%- block body -%}
  <div id="table"></div>
  <div class="option" id="options">
    <div class='icon'><i class='fa fa-plus'></i></div>
    <div class='label'>
      <h3>Add Question Pool</h3>
    </div>
  </div>
{%- endblock -%}