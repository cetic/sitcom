class BaseSearch
  STEP           = 30
  MAX_EXPANSIONS = 2147483647 # 2^31 - 1 (max value for ElasticSearch)

  attr_reader :params

  def initialize(params)
    @params = params
  end

  def run
    run_step.results.collect(&:_source)
  end

  private

  def get_base_options
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

    options
  end

  def add_quick_search(options, fields)
    if params[:quick_search] && params[:quick_search].length > 1
      options['query']['filtered']['query'] = {
        'multi_match' => {
          'query'          => params[:quick_search],
          'fields'         => fields,
          'type'           => 'phrase_prefix',
          'max_expansions' => MAX_EXPANSIONS
        }
      }
    end
  end

  def add_string_search(options, field)
    if params[field]
      options['query']['filtered']['filter']['and'] << {
        'multi_match' => {
          'query'          => params[field],
          'fields'         => [field.to_s],
          'type'           => 'phrase_prefix',
          'max_expansions' => MAX_EXPANSIONS
        }
      }
    end
  end

  def add_ids_search(options, field)
    if params[field.to_sym]
      ids = params[field.to_sym].split(',').map(&:to_i)

      if ids.any?
        options['query']['filtered']['filter']['and'] << {
          'terms' => {
            field => ids
          }
        }
      end
    end
  end
end
