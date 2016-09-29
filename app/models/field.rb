class Field < ApplicationRecord

  # Associations

  belongs_to :parent, :class_name => 'Field',
                      :optional   => true

  has_many :children, :class_name  => 'Field',
                      :foreign_key => :parent_id,
                      :dependent   => :destroy

  has_many :contact_field_links, :dependent => :destroy
  has_many :contacts, :through => :contact_field_links

  # Validations

  validates :name, :presence   => { :message => "Le nom est obligatoire."  },
                   :uniqueness => { :message => "Ce nom est déjà utilisé.", :scope => :parent_id }

  # Callbacks

  after_commit   :after_commit_callback, on: [:create, :update]
  around_destroy :around_destroy_callback

  def after_commit_callback
    contacts.import
    contacts.each(&:cable_update)
  end

  def around_destroy_callback
    saved_contact_ids = contacts.pluck(:id)
    yield
    saved_contacts = Contact.where(:id => saved_contact_ids)
    saved_contacts.import
    saved_contacts.each(&:cable_update)
  end

  # Methods

  def as_indexed_json(options = {})
    ActiveSupport::HashWithIndifferentAccess.new({
      :id        => id,
      :parent_id => parent_id,
      :name      => name
    })
  end

  # Class Methods

  def self.root_options(allow_blank = false)
    options = where(parent_id: nil).order(:name).collect do |field|
      [ field.name, field.id ]
    end

    allow_blank ? [['', nil]] + options : options
  end
end
