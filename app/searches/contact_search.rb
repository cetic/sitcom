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

    [:organization_ids, :field_ids, :event_ids, :project_ids].each do |key|
      if params[key]
        ids = params[key].split(',').map(&:to_i)

        if ids.any?
          options['query']['filtered']['filter']['and'] << {
            'terms' => {
              key => ids
            }
          }
        end
      end
    end

    Contact.search(options)
  end
end
