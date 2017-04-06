module OrganizationIndexConcern
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model

    index_name "sitcom-#{Rails.env}-organizations"

    settings CommonIndexConcern::SETTINGS_HASH do
      mappings do
        indexes :id,     :index => 'not_analyzed'
        indexes :lab_id
        indexes :name
        indexes :status
        indexes :description
        indexes :website_url
        indexes :contact_ids, :index => 'not_analyzed'

        indexes :notes, :type => 'nested'

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

      :sort_name => name,

      :updated_at => updated_at
    }

    if options[:simple]
      ActiveSupport::HashWithIndifferentAccess.new(fields)
    else
      ActiveSupport::HashWithIndifferentAccess.new(fields.merge({
        :contact_links => contact_links_as_indexed_json,
        :event_links   => event_links_as_indexed_json,
        :project_links => project_links_as_indexed_json,
        :notes         => notes_as_indexed_json
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
end
