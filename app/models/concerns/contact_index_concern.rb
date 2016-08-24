module ContactIndexConcern
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    index_name "sitcom-#{Rails.env}-contacts"

    settings CommonIndexConcern::SETTINGS_HASH do
      mappings do
        indexes :id,     :index => 'not_analyzed'
        indexes :lab_id, :index => 'not_analyzed'
        indexes :name
        indexes :first_name
        indexes :last_name
        indexes :active, :index => 'not_analyzed'
        indexes :email
        indexes :phone
        indexes :address
        indexes :organization_ids, :index => 'not_analyzed'
        indexes :field_ids,        :index => 'not_analyzed'
        indexes :projects_ids,     :index => 'not_analyzed'
        indexes :events_ids,       :index => 'not_analyzed'

        indexes :sort_name, :analyzer => :sortable_string_analyzer
      end
    end
  end

  def as_indexed_json(options = {})
    fields = {
      :id     => id,
      :lab_id => lab_id,
      :active => active,
      :email  => email,
      :phone  => phone,

      :twitter_url  => twitter_url,
      :linkedin_url => linkedin_url,
      :facebook_url => facebook_url,
      :picture_url  => picture_url,

      :name             => name,
      :first_name       => first_name,
      :last_name        => last_name,
      :address          => address,
      :address_street   => address_street,
      :address_zip_code => address_zip_code,
      :address_city     => address_city,
      :address_country  => address_country,

      :organization_ids => organization_ids,
      :field_ids        => field_ids,
      :event_ids        => event_ids,
      :project_ids      => project_ids,

      :sort_name => name
    }

    if options[:simple]
      fields
    else
      fields.merge({
        :organizations => organizations_as_indexed_json,
        :fields        => fields_as_indexed_json,
        :events        => events_as_indexed_json,
        :projects      => projects_as_indexed_json,
        :notes         => notes_as_indexed_json,
      })
    end
  end

  def organizations_as_indexed_json
    organizations.collect do |organization|
      organization.as_indexed_json({
        :simple => true
      })
    end
  end

  def events_as_indexed_json
    events.collect do |event|
      event.as_indexed_json({
        :simple => true
      })
    end
  end

  def projects_as_indexed_json
    projects.collect do |project|
      project.as_indexed_json({
        :simple => true
      })
    end
  end

  def notes_as_indexed_json
    notes.collect do |note|
      note.as_indexed_json
    end
  end

  def fields_as_indexed_json
    fields.collect do |field|
      field.as_indexed_json
    end
  end
end
