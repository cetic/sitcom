class MassDestroyService

  def initialize(current_user, item_type, ids)
    @current_user = current_user
    @item_type    = item_type
    @ids          = ids
  end

  def destroy
    items = @item_type.constantize.where(:id => @ids)

    return if items.empty?

    items.each do |item|
      destroy_item(item)
    end

    ItemTagService.cleanup_orphan_tags(items.first.lab)
  end

  private

  def destroy_item(item)
    previous_association_ids = item.association_ids

    if item.destroy!
      LogEntry.log_destroy(@current_user, item, previous_association_ids)
    end
  end

end
