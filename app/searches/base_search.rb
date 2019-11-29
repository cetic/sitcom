class BaseSearch

  STEP = 10_000 # should be <= 10_000 (https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-from-size.html)

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
        'bool' => {
          'filter' => [
            'term' => { 'lab_id' => params[:lab_id] },
          ],
        },
      },

      'sort' => [ { 'sort_name' => { 'order' => 'asc' }} ],

      'size' => STEP
    }

    if params[:only_ids]
      options = options.merge({
        'stored_fields' => [] # ask only for hits ids
      })
    end

    options
  end

  def add_own_ids_search(options)
    if params[:ids].present?
      ids = params[:ids].split(',').map(&:to_i)

      if ids.any?
        options['query']['bool']['filter'] << {
          'terms' => {
            'id' => ids
          }
        }
      end
    end
  end

  def add_quick_search(options, fields)
    if params[:quick_search].present?
      options['query']['bool']['filter'] << {
        'multi_match' => {
          'query'  => params[:quick_search],
          'fields' => fields,
          'type'   => 'phrase_prefix'
        }
      }
    end
  end

  def add_string_search(options, field)
    if params[field].present?
      options['query']['bool']['filter'] << {
        'match_phrase_prefix' => {
          field.to_s => {
            "query" => params[field],
          },
        }
      }
    end
  end

  def add_ids_search(options, field)
    if params[field.to_sym].present?
      ids = params[field.to_sym].split(',').map(&:to_i)

      if ids.any?
        options['query']['bool']['filter'] << {
          'terms' => {
            field => ids
          }
        }
      end
    end
  end

  def add_notes_search(options)
    options['query']['bool']['filter'] << {
      'nested' => {
        'path' => 'notes',

        'query' => {
          'bool' => {
            'must' => [
              {
                'multi_match' => {
                  'query'  => params[:notes],
                  'fields' => ['notes.text', 'notes.name'],
                  'type'   => 'phrase_prefix'
                }
              },

              {
                'bool' => {
                  'should' => [
                    { 'term' => { 'notes.privacy' => 'public' } },

                    'bool' => {
                      'must' => [
                        { 'term' => { 'notes.privacy' => 'private' } },
                        { 'term' => { 'notes.user_id' => user.id   } }
                      ]
                    }
                  ]
                }
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
        if custom_field.field_type == 'text'
          add_custom_text_field_search(options, custom_field, value)
        elsif custom_field.field_type.in? ['bool', 'enum']
          add_custom_term_field_search(options, custom_field, value)
        end
      end
    end
  end

  def add_custom_text_field_search(options, custom_field, value)
    options['query']['bool']['filter'] << {
      'nested' => {
        'path' => 'custom_fields',

        'query' => {
          'bool' => {
            'must' => [
              {
                'term' => { 'custom_fields.id' => custom_field.id }
              },

              {
                'match_phrase_prefix' => {
                  'custom_fields.value' => {
                    'query' => value.to_s,
                  },
                }
              }
            ]
          }
        }
      }
    }
  end

  def add_custom_term_field_search(options, custom_field, value)
    options['query']['bool']['filter'] << {
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
end
