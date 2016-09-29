class ContactTagService

  def initialize(contact)
    @lab          = contact.lab
    @contact      = contact
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
    else
      tag = existing_tag.first
    end

    # Link tag to contact
    ContactTagLink.where(
      :contact_id => @contact.id,
      :tag_id     => tag.id
    ).first_or_create!

    # reindex contact
    @contact.__elasticsearch__.index_document

    # websockets
    @contact.cable_update

    tag
  end

  def remove_tag(tag_id, add_history_comment = true)
    tag = Tag.find(tag_id)

    # Remove link between tag and contact
    tag.contact_tag_links.where(:contact_id => @contact.id)
                         .destroy_all

    # Remove tag if it's the last one
    tag.destroy! if tag.contact_tag_links.empty?

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
