module EventIndexConcern
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model

    index_name "sitcom-#{Rails.env}-events"

    settings CommonIndexConcern::SETTINGS_HASH do
      mappings do
        indexes :id,          :index => 'not_analyzed'
        indexes :lab_id,      :index => 'not_analyzed'
        indexes :name
        indexes :happens_on, :type => 'date'
        indexes :place
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
      :happens_on  => happens_on,
      :place       => place,
      :description => description,
      :website_url => website_url,

      :picture_url         => picture_url,
      :preview_picture_url => picture_url(:preview),
      :thumb_picture_url   => picture_url(:thumb),

      :contact_ids      => contact_ids,
      :organization_ids => organization_ids,
      :project_ids      => project_ids,

      :sort_name => name,

      :updated_at => updated_at
    }

    if options[:simple]
      ActiveSupport::HashWithIndifferentAccess.new(fields)
    else
      ActiveSupport::HashWithIndifferentAccess.new(fields.merge({
        :contacts      => contacts_as_indexed_json,
        :organizations => organizations_as_indexed_json,
        :projects      => projects_as_indexed_json,
        :notes         => notes_as_indexed_json
      }))
    end
  end

  def contacts_as_indexed_json
    contacts.collect do |contact|
      contact.as_indexed_json({
        :simple => true
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
end
