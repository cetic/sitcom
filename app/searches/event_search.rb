class EventSearch < BaseSearch
  def run_step
    options = get_base_options

    add_quick_search(options, [ 'name', 'place', 'description', 'website_url' ])

    [ 'name', 'place', 'description', 'website_url' ].each do |field|
      add_string_search(options, field)
    end

    [ 'contact_ids' ].each do |field|
      add_ids_search(options, field)
    end

    if params['from'] && params['to']
      options['query']['filtered']['filter']['and'] << {
        'range' => {
          'happens_on' => {
            'gte' => params['from'],
            'lte' => params['to']
          }
        }
      }
    end

    if params[:notes].present?
      add_notes_search(options)
    end

    add_custom_fields_search(options)

    Event.search(options)
  end
end
