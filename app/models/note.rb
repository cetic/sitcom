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

end
