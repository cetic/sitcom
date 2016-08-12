class ContactSearch < BaseSearch
  def run_step(from)
    options = {
      'query' => {
        'filtered' => {
          'filter' => {
            'and' => [
              { 'term'   => { 'lab_id' => params[:lab_id] } },
            ]
          },
        },
      },

      'sort' => [ { 'sort_name' => { 'order' => 'asc' }} ],

      'from' => from,
      'size' => STEP
    }

    if params[:query] && params[:query].length > 1
      options['query']['filtered']['query'] = {
        'multi_match' => {
          'query' => params[:query],

          'fields' => [
            'name',
            'email',
            'phone',
            'address'
          ],

          'type'           => 'phrase_prefix',
          'max_expansions' => MAX_EXPANSIONS
        }
      }
    end

    if params[:name]
      options['query']['filtered']['filter']['and'] << {
        'multi_match' => {
          'query'          => params[:name],
          'fields'         => ['name'],
          'type'           => 'phrase_prefix',
          'max_expansions' => MAX_EXPANSIONS
        }
      }
    end

    if params[:active]
      options['query']['filtered']['filter']['and'] << {
        'term' => {
          'active' => params[:active] == '1'
        }
      }
    end

    Contact.search(options)
  end
end
