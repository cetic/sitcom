class OrganizationSearch < BaseSearch
  def run_step
    options = get_base_options

    add_own_ids_search(options)

    add_quick_search(options, [ 'name', 'status', 'description', 'website_url' ])

    [ 'name', 'status', 'description', 'website_url', 'company_number', 'address' ].each do |field|
      add_string_search(options, field)
    end

    [ 'contact_ids', 'event_ids', 'project_ids', 'tag_ids' ].each do |field|
      add_ids_search(options, field)
    end

    if params[:notes].present?
      add_notes_search(options)
    end

    add_custom_fields_search(options)

    Organization.search(options)
  end
end
