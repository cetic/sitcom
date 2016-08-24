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

  def as_indexed_json(options = {})
    {
      :id        => id,
      :parent_id => parent_id,
      :name      => name
    }
  end

  # Class Methods

  def self.root_options(allow_blank = false)
    options = where(parent_id: nil).order(:name).collect do |field|
      [ field.name, field.id ]
    end

    allow_blank ? [['', nil]] + options : options
  end
end
