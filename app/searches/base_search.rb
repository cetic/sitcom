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
      self.class.reject_private_notes_from_collection(results)
    end
  end

  def self.reject_private_notes_from_collection(results)
    results.collect do |result|
      reject_private_notes_from_result(result)
    end
  end

  def self.reject_private_notes_from_result(result)
    result.merge({
      'notes' => reject_private_notes(result['notes'])
    })
  end

  def self.reject_private_notes(notes)
    notes.reject do |note|
      note['privacy'] == 'private'
    end
  end

  def self.reject_private_documents_from_collection(results)
    results.collect do |result|
      reject_private_documents_from_result(result)
    end
  end

  def self.reject_private_documents_from_result(result)
    result.merge({
      'documents' => reject_private_documents(result['documents'])
    })
  end

  def self.reject_private_documents(documents)
    documents.reject do |document|
      document['privacy'] == 'private'
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

  def add_own_ids_search(options)
    if params[:ids].present?
      ids = params[:ids].split(',').map(&:to_i)

      if ids.any?
        options['query']['filtered']['filter']['and'] << {
          'terms' => {
            'id' => ids
          }
        }
      end
    end
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
                      { 'term' => { 'notes.privacy' => 'private' } },
                      { 'term' => { 'notes.user_id' => user.id   } }
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

  def add_custom_fields_search(options)
    custom_field_ids = params.keys.select { |k| k.start_with?('custom_field') }
                                  .map    { |k| k.split('custom_field').last.to_i }

    custom_field_ids.each do |custom_field_id|
      custom_field = CustomField.find(custom_field_id)
      value        = params["custom_field#{custom_field_id}"]

      if value.present?
        method_name = "add_custom_#{custom_field.field_type}_field_search".to_sym
        send(method_name, options, custom_field, value)
      end
    end
  end

  def add_custom_text_field_search(options, custom_field, value)
    options['query']['filtered']['filter']['and'] << {
      'nested' => {
        'path' => 'custom_fields',

        'query' => {
          'bool' => {
            'must' => [
              {
                'term' => { 'custom_fields.id' => custom_field.id }
              },

              {
                'multi_match' => {
                  'query'          => value.to_s,
                  'fields'         => ['custom_fields.value'],
                  'type'           => 'phrase',
                  'max_expansions' => MAX_EXPANSIONS
                }
              }
            ]
          }
        }
      }
    }
  end

  def add_custom_bool_field_search(options, custom_field, value)

    #raise value

    options['query']['filtered']['filter']['and'] << {
      'nested' => {
        'path' => 'custom_fields',

        'query' => {
          'bool' => {
            'must' => [
              { 'term' => { 'custom_fields.id'        => custom_field.id } },
              { 'term' => { 'custom_fields.raw_value' => value.to_s      } }
            ]
          }
        }
      }
    }
  end

  alias_method :add_custom_enum_field_search, :add_custom_bool_field_search

end
