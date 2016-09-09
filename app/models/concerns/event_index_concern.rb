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

        indexes :sort_name, :analyzer => :sortable_string_analyzer
      end
    end

    after_commit   :after_commit_callback, on: [:create, :update]
    around_destroy :around_destroy_callback
  end

  def after_commit_callback
    __elasticsearch__.index_document
    contacts.import
  end

  def around_destroy_callback
    saved_contact_ids = contacts.pluck(:id)

    yield

    __elasticsearch__.delete_document

    Contact.where(:id => saved_contact_ids).import
  end

  def as_indexed_json(options = {})
    fields = {
      :id          => id,
      :lab_id      => lab_id,
      :path        => path,
      :scoped_path => scoped_path,

      :name                => name,
      :happens_on          => happens_on,
      :place               => place,
      :description         => description,
      :website_url         => website_url,

      :picture_url         => picture_url,
      :preview_picture_url => picture_url(:preview),
      :thumb_picture_url   => picture_url(:thumb),

      :contact_ids => contact_ids,

      :sort_name => name
    }

    if options[:simple]
      fields
    else
      fields.merge({
        :contacts => contacts_as_indexed_json,
        :notes    => notes_as_indexed_json
      })
    end
  end

  def contacts_as_indexed_json
    contacts.collect do |contact|
      contact.as_indexed_json({
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
