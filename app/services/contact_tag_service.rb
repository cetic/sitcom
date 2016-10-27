class ContactTagService

  def initialize(current_user, contact)
    @lab          = contact.lab
    @contact      = contact
    @current_user = current_user
  end

  def add_tag(tag_name, add_history_comment = true)
    tag_name = tag_name.strip

    # Create tag if not present
    existing_tag = @lab.tags.where(:name => tag_name)

    if existing_tag.empty?
      tag = @lab.tags.create!(
        :name  => tag_name,
        :color => Tag.random_color(@lab)
      )

      # Log the creation of tag (useful to get name and color in history of contacts)
      LogEntry.log_create(@current_user, tag)
    else
      tag = existing_tag.first
    end

    # for log entries
    previous_associations_ids = @contact.association_ids

    # Link tag to contact
    ContactTagLink.where(
      :contact_id => @contact.id,
      :tag_id     => tag.id
    ).first_or_create!

    # for log entries
    @contact.reload
    LogEntry.log_update(@current_user, @contact, previous_associations_ids)

    # reindex contact
    @contact.__elasticsearch__.index_document

    # websockets
    @contact.cable_update

    tag
  end

  def remove_tag(tag_id, add_history_comment = true)
    tag = Tag.find(tag_id)

    # for log entries
    previous_associations_ids = @contact.association_ids

    # Remove link between tag and contact
    tag.contact_tag_links.where(:contact_id => @contact.id)
                         .destroy_all

    # for log entries
    @contact.reload
    LogEntry.log_update(@current_user, @contact, previous_associations_ids)

    # Remove tag if it's the last one
    if tag.contact_tag_links.empty?
      if tag.destroy
        # Log the deletion of tag (useful to get name and color in history of contacts)
        LogEntry.log_destroy(@current_user, tag, {})
      end
    end

    # reindex contact
    @contact.__elasticsearch__.index_document

    # websockets
    @contact.cable_update
  end

  def self.cleanup_orphan_tags(lab)
    lab.tags.each do |tag|
      if tag.contact_tag_links.empty?
        tag.destroy
      end
    end
  end
end
