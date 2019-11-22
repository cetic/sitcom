class ProjectSearch < BaseSearch
  def run_step
    options = get_base_options

    add_own_ids_search(options)

    add_quick_search(options, [ 'name', 'description' ])

    [ 'name', 'description' ].each do |field|
      add_string_search(options, field)
    end

    [ 'contact_ids', 'organization_ids', 'event_ids', 'tag_ids' ].each do |field|
      add_ids_search(options, field)
    end

    if params['from'].present? && params['to'].present?
      options['query']['bool']['must'] ||= []

      options['query']['bool']['must'] << {
        'bool' => {
          'should' => [
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
      }
    end

    if params[:notes].present?
      add_notes_search(options)
    end

    add_custom_fields_search(options)

    Project.search(options)
  end
end
