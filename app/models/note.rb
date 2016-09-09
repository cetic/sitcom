class Note < ApplicationRecord

  # Modules

  extend Enumerize

  # Enums

  enumerize :privacy, :in      => [ :public, :private ],
                      :default => :private

  # Association

  belongs_to :notable, :polymorphic => true
  belongs_to :user,    :required    => false

  # Validations

  validates :text, :presence => { :message => 'Le texte est obligaroire.' }

  # Callbacks

  after_commit   :after_commit_callback, on: [:create, :update]
  around_destroy :around_destroy_callback

  def after_commit_callback
    notable.__elasticsearch__.index_document
  end

  def around_destroy_callback
    saved_notable_id = notable_id
    yield
    notable.__elasticsearch__.index_document
  end

  # Methods

  def path
    "/#{notable.lab.slug}/#{notable_type.pluralize.underscore}/#{self.notable.id}/notes/#{self.id}"
  end

  def as_indexed_json(options = {})
    {
      :id      => id,
      :text    => text,
      :privacy => privacy,
      :path    => path
    }
  end

end
