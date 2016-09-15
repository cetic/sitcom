class ProjectSearch < BaseSearch
  def run_step
    options = get_base_options

    add_quick_search(options, [ 'name', 'description' ])

    [ 'name', 'description' ].each do |field|
      add_string_search(options, field)
    end

    [ 'contact_ids' ].each do |field|
      add_ids_search(options, field)
    end

    if params['from'] && params['to']
      options['query']['filtered']['filter']['and'] << {
        'or' => [
          {
            'range' => {
              'start_date' => {
                'gte' => params['from'],
                'lte' => params['to']
              }
            }
          },

          {
            'range' => {
              'end_date' => {
                'gte' => params['from'],
                'lte' => params['to']
              }
            }
          }
        ]
      }
    end

    if params[:notes].present?
      add_notes_search(options)
    end

    Project.search(options)
  end
end
