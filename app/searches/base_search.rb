class BaseSearch
  STEP           = 10000
  MAX_EXPANSIONS = 2147483647 # 2^31 - 1 (max value for ElasticSearch)

  attr_reader :params, :user

  def initialize(user, params)
    @user   = user
    @params = params
  end

  def run
    if params[:only_ids]
      # we only get meta informations when fetching ids => http://stackoverflow.com/a/17497442/1243212
      results = run_step.results.results.collect(&:_id).collect(&:to_i)
    else
      results = run_step.results.collect(&:_source)
      self.class.reject_private_notes_from_collection(results, user)
    end
  end

  def self.reject_private_notes_from_collection(results, user)
    results.collect do |result|
      reject_private_notes_from_result(result, user)
    end
  end

  def self.reject_private_notes_from_result(result, user)
    result.merge({
      'notes' => reject_private_notes(result['notes'], user)
    })
  end

  def self.reject_private_notes(notes, user)
    notes.select do |note|
      note['privacy'] == 'public' || note['user_id'] == user.id
    end
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

    if params[:only_ids]
      options = options.merge({
        'fields' => []
      })
    end

    options
  end

  def add_quick_search(options, fields)
    if params[:quick_search].present?
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
    if params[field].present?
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
    if params[field.to_sym].present?
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

  def add_notes_search(options)
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
                    'term' => { 'notes.privacy' => 'public' }
                  },

                  {
                    'and' => [
                      {
                        'term' => { 'notes.privacy' => 'private' },
                        'term' => { 'notes.user_id' => user.id   }
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
end
