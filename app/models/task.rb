class Task < ApplicationRecord

  include ActionView::Helpers::TextHelper

  # Associations

  belongs_to :user, :optional => true
  belongs_to :item, :optional => true, :polymorphic => true

  # Validations

  validates :name, :presence => true

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
    "/#{item.lab.slug}/#{item_type.pluralize.underscore}/#{self.item.id}/notes/#{self.id}"
  end

  def as_indexed_json(options = {})
    ActiveSupport::HashWithIndifferentAccess.new({
      :id             => id,
      :user_id        => user_id,
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
