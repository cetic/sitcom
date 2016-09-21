class ContactSearch < BaseSearch
  def run_step
    options = get_base_options

    add_quick_search(options, [ 'name', 'email', 'phone', 'address' ])

    [ 'name', 'email', 'address', 'phone' ].each do |field|
      add_string_search(options, field)
    end

    [ 'organization_ids', 'field_ids', 'event_ids', 'project_ids', 'tag_ids' ].each do |field|
      add_ids_search(options, field)
    end

    if params[:active].present?
      options['query']['filtered']['filter']['and'] << {
        'term' => {
          'active' => params[:active] == 'true'
        }
      }
    end

    if params[:notes].present?
      add_notes_search(options)
    end

    Contact.search(options)
  end
end
