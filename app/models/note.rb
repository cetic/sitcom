class Note < ApplicationRecord

  # Modules

  extend Enumerize

  # Enums

  enumerize :privacy, :in      => [ :public, :private ],
                      :default => :private

  # Association

  belongs_to :notable, :polymorphic => true

  # Validations

  validates :text, :presence => { :message => 'Le texte est obligaroire.' }

  # Methods

  def index_dependent_rows(and_destroy = false)
    saved_contact_ids = [contact_id]

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
      :id      => id,
      :text    => text,
      :privacy => privacy,
    }
  end

end
