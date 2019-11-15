module OrganizationIndexConcern
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model

    index_name "sitcom-#{Rails.env}-organizations"

    settings CommonIndexConcern::SETTINGS_HASH do
      mappings do
        indexes :id,          :type => 'long'
        indexes :lab_id,      :type => 'long'
        indexes :name,        :type => 'text'
        indexes :status,      :type => 'text'
        indexes :description, :type => 'text'
        indexes :website_url, :type => 'text'

        indexes :contact_ids, :type => 'long'
        indexes :event_ids,   :type => 'long'
        indexes :project_ids, :type => 'long'
        indexes :tag_ids,     :type => 'long'

        indexes :notes, :type => 'nested'

        indexes :documents, :type => 'nested'

        indexes :custom_fields, :type => 'nested' do
          indexes :id,        :type => 'long'
          indexes :value,     :type => 'text'
          indexes :raw_value, :type => 'keyword'
        end

        indexes :sort_name, :type => 'keyword'

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

      :name        => name,
      :status      => status,
      :description => description,
      :website_url => website_url,

      :picture_url         => picture_url,
      :preview_picture_url => picture_url(:preview),
      :thumb_picture_url   => picture_url(:thumb),

      :contact_ids => contact_ids,
      :event_ids   => event_ids,
      :project_ids => project_ids,
      :tag_ids     => tag_ids,

      :sort_name => sort_name,

      :updated_at => updated_at
    }

    if options[:simple]
      ActiveSupport::HashWithIndifferentAccess.new(fields)
    else
      ActiveSupport::HashWithIndifferentAccess.new(fields.merge({
        :contact_links => contact_links_as_indexed_json,
        :event_links   => event_links_as_indexed_json,
        :project_links => project_links_as_indexed_json,
        :notes         => notes_as_indexed_json,
        :documents     => documents_as_indexed_json,
        :tags          => tags_as_indexed_json,
        :custom_fields => custom_fields_as_json
      }))
    end
  end

  def contact_links_as_indexed_json
    contact_organization_links.collect do |link|
      {
        :id   => link.id,
        :role => link.role,
        :path => link.path,

        :contact => link.contact.as_indexed_json({
          :simple => true
        })
      }
    end
  end

  def event_links_as_indexed_json
    event_organization_links.collect do |link|
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
    organization_project_links.collect do |link|
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

  def notes_as_indexed_json
    notes.collect do |note|
      note.as_indexed_json
    end
  end

  def documents_as_indexed_json
    documents.collect do |file|
      file.as_indexed_json
    end
  end

  def tags_as_indexed_json
    tags.collect do |tag|
      tag.as_indexed_json
    end
  end
end
