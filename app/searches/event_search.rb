class EventSearch < BaseSearch
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
          ],

          'type'           => 'phrase_prefix',
          'max_expansions' => MAX_EXPANSIONS
        }
      }
    end

    [:name].each do |key|
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

    [:contact_ids].each do |key|
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

    Event.search(options)
  end
end
