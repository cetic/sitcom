class Organization < ApplicationRecord

  # Concerns

  include CommonIndexConcern
  include OrganizationIndexConcern

  # Uploaders

  mount_uploader :picture, PictureUploader

  # Associations

  belongs_to :lab

  has_many :contact_organization_links, :dependent => :destroy
  has_many :contacts, :through => :contact_organization_links

  has_many :notes, :as => :notable

  # Validations

  validates :name, :presence   => { :message => "Le nom est obligatoire."  },
                   :uniqueness => { :message => "Le nom indiqué existe déjà." }

  validates :website_url, :format      => { :with => URI::regexp(%w(http https)), :message => "L'adresse du site Web est invalide." },
                          :allow_blank => true

  # Methods

  def index_dependent_rows(and_destroy = false)
    saved_contact_ids = contact_ids

    destroy! if and_destroy

    Contact.where(id: saved_contact_ids).each do |row|
      row.__elasticsearch__.index_document
    end
  end

  def destroy_and_index_dependent_rows
    index_dependent_rows(true)
  end

end
