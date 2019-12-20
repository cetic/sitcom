class CustomField < ApplicationRecord

  # Modules

  extend Enumerize

  # not really used for now
  acts_as_list :scope => [ :lab_id, :item_type ]

  # Attributes

  serialize :options, JSON

  # Callbacks

  after_initialize do |instance|
    instance.options ||= []
  end

  # Enums

  enumerize :field_type, :in      => [ :text, :bool, :enum ],
                         :default => :text,
                         :scope   => true

  # Associations

  belongs_to :lab

  has_many :custom_field_links, :dependent => :destroy

  # Validations

  validates :name, :presence   => { :message => "Le nom est obligatoire."                                            },
                   :uniqueness => {
                     :message        => "Ce nom de chams est déjà utilisé.",
                     :scope          => [:lab_id, :item_type],
                     :case_sensitive => false
                   }

  validates :field_type, :inclusion => {
    :in      => CustomField.field_type.values,
    :message => "Le type de champs est invalide."
  }

  # Methods

  def ensure_concistency
    if field_type.enum?
      custom_field_links.each do |custom_field_link|
        unless options.include?(custom_field_link.value)
          custom_field_link.destroy
        end
      end
    end
  end

  # Class Methods

  class << self
    def item_type_options
      [
        ['Lié aux contacts',      'Contact'     ],
        ['Lié aux organisations', 'Organization'],
        ['Lié aux projets',       'Project'     ],
        ['Lié aux évènements',    'Event'       ]
      ]
    end
  end

end
