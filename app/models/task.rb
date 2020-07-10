class Task < ApplicationRecord

  include ActionView::Helpers::TextHelper

  # Associations

  belongs_to :user, :optional => true
  belongs_to :item, :optional => true, :polymorphic => true

  # Validations

  validates :name, :presence => true

  # Callbacks

  after_commit   :after_commit_callback, on: [:create, :update]
  around_destroy :around_destroy_callback

  def after_commit_callback
    "Reindex#{item_type}Worker".constantize.perform_async(item_id)
    item.cable_update
  end

  def around_destroy_callback
    saved_item_id   = item_id
    saved_item_type = item_type
    yield
    "Reindex#{item_type}Worker".constantize.perform_async(saved_item_id)
    saved_item = saved_item_type.constantize.find(saved_item_id)
    saved_item.cable_update
  end

  # Methods

  def done?
    done_at.present?
  end

  def toggle
    update!(
      :done_at => done? ? nil : Time.zone.now
    )
  end

  def path
    "/#{item.lab.slug}/#{item_type.pluralize.underscore}/#{self.item.id}/tasks/#{self.id}"
  end

  def as_indexed_json(options = {})
    ActiveSupport::HashWithIndifferentAccess.new({
      :id             => id,
      :user_id        => user_id,
      :user_name      => user_id ? user.name : "",
      :name           => name.to_s,
      :text           => text.to_s,
      :formatted_text => simple_format(text),
      :execution_date => execution_date,
      :done_at        => done_at,
      :done           => done?,
      :path           => path
    })
  end

end
