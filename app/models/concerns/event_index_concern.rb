module EventIndexConcern
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    index_name "sitcom-#{Rails.env}-events"

    settings CommonIndexConcern::SETTINGS_HASH do
      mappings do
        indexes :id,          :index => 'not_analyzed'
        indexes :lab_id,      :index => 'not_analyzed'
        indexes :name
        indexes :happens_on
        indexes :place
        indexes :description
        indexes :website_url
        indexes :contact_ids, :index => 'not_analyzed'

        indexes :sort_name, :analyzer => :sortable_string_analyzer
      end
    end
  end

  def as_indexed_json(options = {})
    {
      :id     => id,
      :lab_id => lab_id,

      :name        => name,
      :happens_on  => happens_on,
      :place       => place,
      :description => description,
      :website_url => website_url,
      :picture_url => picture.url,

      :contact_ids => contact_ids,
      :contacts    => contacts_as_indexed_json,

      :sort_name => name
    }
  end

  def contacts_as_indexed_json
    contacts.collect do |contact|
      {
        :id   => contact.id,
        :name => contact.name
      }
    end
  end
end
