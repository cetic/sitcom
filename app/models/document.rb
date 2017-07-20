class Document < ApplicationRecord

  # Modules

  extend Enumerize

  # Uploaders

  mount_uploader :file, FileUploader

  # Enums

  enumerize :privacy, :in      => [ :public, :private ],
                      :default => :private,
                      :scope   => true

  # Association

  belongs_to :uploadable, :polymorphic => true, :touch => true
  belongs_to :user,       :required    => false

  # Callbacks

  after_commit   :after_commit_callback, on: [:create, :update]
  around_destroy :around_destroy_callback

  def after_commit_callback
    "Reindex#{uploadable_type}Worker".constantize.perform_async(uploadable_id)
    uploadable.cable_update
  end

  def around_destroy_callback
    saved_uploadable_id   = uploadable_id
    saved_uploadable_type = uploadable_type
    yield
    "Reindex#{uploadable_type}Worker".constantize.perform_async(saved_uploadable_id)
    saved_uploadable = saved_uploadable_type.constantize.find(saved_uploadable_id)
    saved_uploadable.cable_update
  end

  # Methods

  def path
    "/#{uploadable.lab.slug}/#{uploadable_type.pluralize.underscore}/#{self.uploadable.id}/documents/#{self.id}"
  end

  def as_indexed_json(options = {})
    ActiveSupport::HashWithIndifferentAccess.new({
      :id          => id,
      :user_id     => user_id,
      :name        => file_identifier,
      :description => description.to_s,
      :privacy     => privacy,
      :path        => path
    })
  end

end
