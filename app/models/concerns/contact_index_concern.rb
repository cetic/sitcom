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
        indexes :active, :index => 'not_analyzed'
        indexes :email
        indexes :phone
        indexes :address
        indexes :organization_ids, :index => 'not_analyzed'
      end
    end
  end

  def as_indexed_json(options = {})
    basic_fields = [
      :id, :lab_id, :active, :email, :phone,
      :twitter_url, :linkedin_url, :facebook_url, :website_url
    ]

    as_json({ :only => basic_fields }).merge({
      :name             => name,
      :address          => address,
      :address_html     => address(true),
      :organization_ids => organization_ids
    })
  end
end
