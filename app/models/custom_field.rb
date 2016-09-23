class CustomField < ApplicationRecord

  # Modules

  extend Enumerize

  # Enums

  enumerize :field_type, :in      => [ :text, :bool, :enum ],
                         :default => :text,
                         :scope   => true

  # Assocations

  belongs_to :lab

  has_many :custom_field_links, :dependent => :destroy

  # Validations

  validates :name, :presence => { :message => "Le nom est obligatoire."  }

  validates :field_type, :inclusion => {
    :in      => CustomField.field_type.values,
    :message => "Le type de champs est invalide."
  }

end
