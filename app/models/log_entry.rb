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
      :item_id   => item.id,
      :item_type => item.class.name,
      :user_id   => current_user.id,
      :user_name => current_user.name,
      :lab_id    => item.lab_id,
      :action    => :destroy,
      :content   => {}
    )
  end

  # Special process to log notes
  def self.log_create_note(current_user, note)
    log_note(:update, current_user, note)
  end

  def self.log_update_note(current_user, note)
    log_note(:update, current_user, note)
  end

  def self.log_destroy_note(current_user, note)
    if note.privacy.public?
      LogEntry.create(
        :item_id   => note.notable_id,
        :item_type => note.notable_type,
        :user_id   => current_user.id,
        :user_name => current_user.name,
        :lab_id    => note.notable.lab_id,
        :action    => :update,
        :content   => { 'note' => [note.text, nil] }
      )
    end
  end

  def self.log_update_custom_field(current_user, custom_field_link)
    custom_field_name = custom_field_link.custom_field.name
    custom_field_type = custom_field_link.custom_field.field_type

    if custom_field_type.bool?
      value_diff = custom_field_link.bool_value_previous_change
    else
      value_diff = custom_field_link.text_value_previous_change
    end

    custom_field_link.item.log_entries.create(
      :user_id   => current_user.id,
      :user_name => current_user.name,
      :lab_id    => custom_field_link.item.lab_id,
      :action    => :update,
      :content   => { 'custom_field' => { custom_field_name => value_diff } }
    )
  end

  private

  def self.log(action, current_user, item, previous_association_ids = {})
    previous_changes = item.previous_changes.reject do |key, value|
      key.in? %w(id lab_id user_id created_at updated_at)
    end

    item.association_ids.keys.each do |association_name|
      if !previous_association_ids[association_name].nil? && previous_association_ids[association_name] != item.association_ids[association_name]
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

  def self.log_note(action, current_user, note)
    if note.privacy.public?
      note.notable.log_entries.create(
        :user_id   => current_user.id,
        :user_name => current_user.name,
        :lab_id    => note.notable.lab_id,
        :action    => action,
        :content   => { 'note' => note.text_previous_change }
      )
    end
  end

end
