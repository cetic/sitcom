module ProjectIndexConcern
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    index_name "sitcom-#{Rails.env}-projects"

    settings CommonIndexConcern::SETTINGS_HASH do
      mappings do
        indexes :id,          :index => 'not_analyzed'
        indexes :lab_id,      :index => 'not_analyzed'
        indexes :name
        indexes :description
        indexes :start_date
        indexes :end_date
        indexes :contact_ids, :index => 'not_analyzed'

        indexes :sort_name, :analyzer => :sortable_string_analyzer
      end
    end
  end

  def as_indexed_json(options = {})
    {
      :id     => id,
      :lab_id => lab_id,

      :name                => name,
      :description         => description,
      :start_date          => start_date,
      :end_date            => end_date,
      :picture_url         => picture.url,
      :preview_picture_url => picture.url(:preview),

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
