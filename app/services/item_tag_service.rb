class ItemTagService

  def initialize(current_user, item)
    @lab          = item.lab
    @item         = item
    @item_type    = item.class.name
    @current_user = current_user
  end

  def add_tag(tag_name)
    tag_name = tag_name.strip

    # Create tag if not present
    existing_tag = @lab.tags.where(:name => tag_name, :item_type => @item_type)

    if existing_tag.empty?
      tag = @lab.tags.create!(
        :name      => tag_name,
        :item_type => @item_type,
        :color     => Tag.random_color(@lab)
      )

      # Log the creation of tag (useful to get name and color in history of items)
      LogEntry.log_create(@current_user, tag)
    else
      tag = existing_tag.first
    end

    # for log entries
    previous_associations_ids = @item.association_ids

    # Link tag to item
    ItemTagLink.where(
      :item_id   => @item.id,
      :item_type => @item_type,
      :tag_id    => tag.id
    ).first_or_create!

    # for log entries
    @item.reload
    LogEntry.log_update(@current_user, @item, previous_associations_ids)

    # reindex item
    @item.__elasticsearch__.index_document

    # websockets
    @item.cable_update

    tag
  end

  def remove_tag(tag_id)
    tag = Tag.find(tag_id)

    # for log entries
    previous_associations_ids = @item.association_ids

    # Remove link between tag and item
    tag.item_tag_links.where(:item_id => @item.id, :item_type => @item_type)
                      .destroy_all

    # for log entries
    @item.reload
    LogEntry.log_update(@current_user, @item, previous_associations_ids)

    # Remove tag if it's the last one
    if tag.item_tag_links.empty?
      if tag.destroy
        # Log the deletion of tag (useful to get name and color in history of items)
        LogEntry.log_destroy(@current_user, tag, {})
      end
    end

    # reindex item
    @item.__elasticsearch__.index_document

    # websockets
    @item.cable_update
  end

  def self.cleanup_orphan_tags(lab)
    lab.tags.includes(:item_tag_links).each do |tag|
      if tag.item_tag_links.empty?
        tag.destroy
      end
    end
  end
end
