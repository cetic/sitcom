class Note < ApplicationRecord

  # Modules

  extend Enumerize

  # Enums

  enumerize :privacy, :in      => [ :public, :private ],
                      :default => :private,
                      :scope   => true

  # Association

  belongs_to :notable, :polymorphic => true
  belongs_to :user,    :required    => false

  # Validations

  validates :text, :presence => { :message => 'Le texte est obligatoire.' }

  # Callbacks

  after_commit   :after_commit_callback, on: [:create, :update]
  around_destroy :around_destroy_callback

  def after_commit_callback
    "Reindex#{notable_type}Worker".constantize.perform_async(notable_id)
    notable.cable_update
  end

  def around_destroy_callback
    saved_notable_id   = notable_id
    saved_notable_type = notable_type
    yield
    "Reindex#{notable_type}Worker".constantize.perform_async(saved_notable_id)
    saved_notable = saved_notable_type.constantize.find(saved_notable_id)
    saved_notable.cable_update
  end

  # Methods

  def path
    "/#{notable.lab.slug}/#{notable_type.pluralize.underscore}/#{self.notable.id}/notes/#{self.id}"
  end

  def as_indexed_json(options = {})
    ActiveSupport::HashWithIndifferentAccess.new({
      :id      => id,
      :user_id => user_id,
      :text    => text,
      :privacy => privacy,
      :path    => path
    })
  end

end
