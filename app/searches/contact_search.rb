class ContactSearch < BaseSearch
  def run_step
    options = {
      'query' => {
        'filtered' => {
          'filter' => {
            'and' => [
              { 'term' => { 'lab_id' => params[:lab_id] } },
            ]
          },
        },
      },

      'sort' => [ { 'sort_name' => { 'order' => 'asc' }} ],

      'from' => params[:offset].to_i,
      'size' => STEP
    }

    if params[:quick_search] && params[:quick_search].length > 1
      options['query']['filtered']['query'] = {
        'multi_match' => {
          'query' => params[:quick_search],

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

    [:name, :email, :address, :phone].each do |key|
      if params[key]
        options['query']['filtered']['filter']['and'] << {
          'multi_match' => {
            'query'          => params[key],
            'fields'         => [key.to_s],
            'type'           => 'phrase_prefix',
            'max_expansions' => MAX_EXPANSIONS
          }
        }
      end
    end

    if params[:active]
      options['query']['filtered']['filter']['and'] << {
        'term' => {
          'active' => params[:active] == 'true'
        }
      }
    end

    if params[:organization_ids]
      ids = params[:organization_ids].split(',').map(&:to_i)

      if ids.any?
        options['query']['filtered']['filter']['and'] << {
          'terms' => {
            'organization_ids' => ids
          }
        }
      end
    end

    Contact.search(options)
  end
end
