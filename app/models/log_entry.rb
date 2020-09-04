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

  def self.log_destroy(current_user, item, previous_association_ids, previous_follower_ids = [])
    LogEntry.create!(
      :item_id   => item.id,
      :item_type => item.class.name,
      :user_id   => current_user.id,
      :user_name => current_user.name,
      :lab_id    => item.lab_id,
      :action    => :destroy,
      :item_name => item.name,
      :content   => {}
    )

    send_updated_emails_to_followers(item, current_user, :item_removed, previous_follower_ids)

    # Create update log for associated items
    [:organization_ids, :project_ids, :event_ids, :contact_ids].each do |association_type|
      if previous_association_ids[association_type]
        previous_association_ids[association_type].each do |association_id|
          associated_item_class = Object.const_get(association_type[0..-4].camelize)
          associated_item       = associated_item_class.find(association_id)
          old_associated_ids    = associated_item.send("#{item.class.name.underscore}_ids")

          associated_item.log_entries.create!(
            :user_id   => current_user.id,
            :user_name => current_user.name,
            :lab_id    => item.lab_id,
            :action    => :update,
            :item_name => associated_item.name,
            :content   => { "#{item.class.name.underscore}_ids" => [old_associated_ids + [item.id], old_associated_ids] }
          )

          send_updated_emails_to_followers(associated_item, current_user, :item_updated)
        end
      end
    end
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
        :content   => { 'note' => [note.text, nil] },
        :item_name => note.notable.name,
      )

      send_updated_emails_to_followers(note.notable, current_user, :note_updated)
    end
  end

  # Special process for documents
  def self.log_create_document(current_user, document)
    log_document(:update, current_user, document)
  end

  def self.log_update_document(current_user, document)
    log_document(:update, current_user, document)
  end

  def self.log_destroy_document(current_user, document)
    if document.privacy.public?
      LogEntry.create(
        :item_id   => document.uploadable_id,
        :item_type => document.uploadable_type,
        :user_id   => current_user.id,
        :user_name => current_user.name,
        :lab_id    => document.uploadable.lab_id,
        :action    => :update,
        :content   => { 'document' => [document.file_identifier, nil] },
        :item_name => document.uploadable.name
      )

      send_updated_emails_to_followers(document.uploadable, current_user, :document_updated)
    end
  end

  # Special process for custom fields
  def self.log_update_custom_field(current_user, custom_field_link)
    custom_field_name = custom_field_link.custom_field.name
    custom_field_type = custom_field_link.custom_field.field_type

    if custom_field_type.bool?
      value_diff = custom_field_link.bool_value_previous_change
    else
      value_diff = custom_field_link.text_value_previous_change
    end

    if !value_diff.nil? && value_diff[0].to_s.strip != value_diff[1].to_s.strip
      custom_field_link.item.log_entries.create(
        :user_id   => current_user.id,
        :user_name => current_user.name,
        :lab_id    => custom_field_link.item.lab_id,
        :action    => :update,
        :content   => { 'custom_field' => { custom_field_name => value_diff } },
        :item_name => custom_field_link.item.name
      )

      send_updated_emails_to_followers(custom_field_link.item, current_user, :custom_field_updated)
    end
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
        :content   => previous_changes,
        :item_name => item.name
      )

      if action == :update
        send_updated_emails_to_followers(item, current_user, :item_updated)
      end
    end
  end

  def self.log_note(action, current_user, note)
    if note.privacy.public? && note.text_previous_change
      note.notable.log_entries.create(
        :user_id   => current_user.id,
        :user_name => current_user.name,
        :lab_id    => note.notable.lab_id,
        :action    => action,
        :content   => { 'note' => note.text_previous_change },
        :item_name => note.notable.name
      )

      send_updated_emails_to_followers(note.notable, current_user, :note_updated)
    end
  end

  def self.log_document(action, current_user, document)
    if document.privacy.public? && document.file_previous_change
      document.uploadable.log_entries.create(
        :user_id   => current_user.id,
        :user_name => current_user.name,
        :lab_id    => document.uploadable.lab_id,
        :action    => action,
        :content   => { 'document' => document.file_previous_change },
        :item_name => document.uploadable.name
      )

      send_updated_emails_to_followers(document.uploadable, current_user, :document_updated)
    end
  end

  def self.send_updated_emails_to_followers(item, current_user, action = :item_updated, previous_follower_ids = [])
    # (1) item could be "Tag", so we use try()
    # (2) previous_follower_ids is not-empty when item is already destroyed
    follower_ids = (item.try(:follower_ids) || []) + previous_follower_ids - [current_user.id]

    follower_ids.each do |follower_id|
      # Leave deliver_now because it's the only way to pass "item" as an object (useful only for :item_removed action)
      # Also, currently nothing is configured to deliver later in production (use sidekiq and add new queue?)
      ApplicationMailer.item_updated(follower_id, current_user.id, item, action).deliver_now
    end
  end

end
