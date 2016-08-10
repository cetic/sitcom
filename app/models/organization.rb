class Organization < ApplicationRecord

  # Concerns

  include CommonIndexConcern
  include OrganizationIndexConcern

  # Associations

  belongs_to :lab

  has_many :contact_organization_links, :dependent => :destroy
  has_many :contacts, :through => :contact_organization_links

end
