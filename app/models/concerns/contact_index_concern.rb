module ContactIndexConcern
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model

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
        indexes :field_ids,        :index => 'not_analyzed'
        indexes :organization_ids, :index => 'not_analyzed'
        indexes :project_ids,      :index => 'not_analyzed'
        indexes :event_ids,        :index => 'not_analyzed'
        indexes :tag_ids,          :index => 'not_analyzed'

        indexes :notes, :type => 'nested'

        indexes :custom_fields, :type => 'nested' do
          indexes :id,        :index => 'not_analyzed'
          indexes :value
          indexes :raw_value, :index => 'not_analyzed'
        end

        indexes :sort_name, :analyzer => :sortable_string_analyzer

        indexes :updated_at, :type => 'date'
      end
    end
  end

  def as_indexed_json(options = {})
    fields = {
      :id          => id,
      :lab_id      => lab_id,
      :path        => path,
      :scoped_path => scoped_path,

      :active => active,
      :email  => email,
      :phone  => phone,

      :twitter_url  => twitter_url,
      :linkedin_url => linkedin_url,
      :facebook_url => facebook_url,

      :picture_url         => picture_url,
      :preview_picture_url => picture_url(:preview),
      :thumb_picture_url   => picture_url(:thumb),

      :name             => name,
      :first_name       => first_name,
      :last_name        => last_name,
      :address          => address,
      :address_street   => address_street,
      :address_zip_code => address_zip_code,
      :address_city     => address_city,
      :address_country  => address_country,

      :field_ids        => field_ids,
      :organization_ids => organization_ids,
      :project_ids      => project_ids,
      :event_ids        => event_ids,
      :tag_ids          => tag_ids,

      :sort_name => sort_name,

      :updated_at => updated_at
    }

    if options[:simple]
      ActiveSupport::HashWithIndifferentAccess.new(fields)
    else
      ActiveSupport::HashWithIndifferentAccess.new(fields.merge({
        :organization_links => organization_links_as_indexed_json,
        :event_links        => event_links_as_indexed_json,
        :project_links      => project_links_as_indexed_json,
        :fields             => fields_as_indexed_json,
        :notes              => notes_as_indexed_json,
        :tags               => tags_as_indexed_json,
        :custom_fields      => custom_fields_as_json
      }))
    end
  end

  def organization_links_as_indexed_json
    contact_organization_links.collect do |link|
      {
        :id   => link.id,
        :role => link.role,
        :path => link.path,

        :organization => link.organization.as_indexed_json({
          :simple => true
        })
      }
    end
  end

  def event_links_as_indexed_json
    contact_event_links.collect do |link|
      {
        :id   => link.id,
        :role => link.role,
        :path => link.path,

        :event => link.event.as_indexed_json({
          :simple => true
        })
      }
    end
  end

  def project_links_as_indexed_json
    contact_project_links.collect do |link|
      {
        :id   => link.id,
        :role => link.role,
        :path => link.path,

        :project => link.project.as_indexed_json({
          :simple => true
        })
      }
    end
  end

  def fields_as_indexed_json
    fields.collect do |field|
      field.as_indexed_json
    end
  end

  def notes_as_indexed_json
    notes.collect do |note|
      note.as_indexed_json
    end
  end

  def tags_as_indexed_json
    tags.collect do |tag|
      tag.as_indexed_json
    end
  end

  def custom_fields_as_json
    lab.custom_fields.collect do |custom_field|
      field_value = custom_field_value(custom_field).to_s # ES cannot index booleans here

      custom_field_data = {
        :id          => custom_field.id,
        :name        => custom_field.name,
        :field_type  => custom_field.field_type,
        :value       => field_value,
        :raw_value   => field_value
      }

      if custom_field.field_type.enum?
        custom_field_data[:options] = custom_field.options
      end

      custom_field_data
    end
  end
end
