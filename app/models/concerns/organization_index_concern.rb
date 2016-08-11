module OrganizationIndexConcern
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    index_name "sitcom-#{Rails.env}-organizations"

    settings CommonIndexConcern::SETTINGS_HASH do
      mappings do
        indexes :id,     :index => 'not_analyzed'
        indexes :lab_id
        indexes :name
        indexes :status
        indexes :description
        indexes :contact_ids, :index => 'not_analyzed'
      end
    end
  end

  def as_indexed_json(options = {})
    basic_fields = [
      :id, :lab_id, :name, :status, :description, :website_url
    ]

    as_json({ :only => basic_fields }).merge({
      :contact_ids => contact_ids
    })
  end
end
