class LogEntry < ApplicationRecord

  # Modules

  extend Enumerize

  # Associations

  belongs_to :lab
  belongs_to :user
  belongs_to :item, :polymorphic => true,
                    :optional    => true

  # Attributes

  serialize :content, JSON

  # Enums

  enumerize :action, :in    => [ :create, :update, :destroy ],
                     :scope => true

  # Validations

  # Methods

  def self.log_create(current_user, item)
    log(:create, current_user, item)
  end

  def self.log_update(current_user, item, previous_association_ids)
    log(:update, current_user, item, previous_association_ids)
  end

  def self.log_destroy(current_user, item)
    LogEntry.create(
      :user_id   => current_user.id,
      :user_name => current_user.name,
      :item_id   => item.id,
      :item_type => item.class.name,
      :lab_id    => item.lab_id,
      :action    => :destroy,
      :content   => {}
    )
  end

  private

  def self.log(action, current_user, item, previous_association_ids = {})
    previous_changes = item.previous_changes.reject do |key, value|
      key.in? %w(id lab_id user_id created_at updated_at)
    end

    item.association_ids.keys.each do |association_name|
      if previous_association_ids[association_name] != item.association_ids[association_name]
        previous_changes.merge!(
          association_name => [
            previous_association_ids[association_name],
            item.association_ids[association_name]
          ]
        )
      end
    end

    if previous_changes.any?
      item.log_entries.create(
        :user_id   => current_user.id,
        :user_name => current_user.name,
        :lab_id    => item.lab_id,
        :action    => action,
        :content   => previous_changes
      )
    end
  end

end
