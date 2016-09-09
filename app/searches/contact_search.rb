class ContactSearch < BaseSearch
  def run_step
    options = get_base_options

    add_quick_search(options, [ 'name', 'email', 'phone', 'address' ])

    [ 'name', 'email', 'address', 'phone' ].each do |field|
      add_string_search(options, field)
    end

    [ 'organization_ids', 'field_ids', 'event_ids', 'project_ids' ].each do |field|
      add_ids_search(options, field)
    end

    if params[:active]
      options['query']['filtered']['filter']['and'] << {
        'term' => {
          'active' => params[:active] == 'true'
        }
      }
    end

    if params[:notes]
      options['query']['filtered']['filter']['and'] << {

        'nested' => {
          'path' => 'notes',

          'query' => {
            'bool' => {
              'must' => [
                {
                  'multi_match' => {
                    'query'          => params[:notes],
                    'fields'         => ['notes.text'],
                    'type'           => 'phrase',
                    'max_expansions' => MAX_EXPANSIONS
                  }
                },

                {
                  'or' => [
                    {
                      'term' => {
                        'notes.privacy' => 'public'
                      }
                    },

                    {
                      'and' => [
                        {
                          'term' => {
                            'notes.privacy' => 'private'
                          },

                          'term' => {
                            'notes.user_id' => user.id
                          }
                        },
                      ]
                    }
                  ]
                }


              ]
            }
          }
        }
      }
    end

    Contact.search(options)
  end
end
