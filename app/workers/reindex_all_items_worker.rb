class ReindexAllItemsWorker

  include Sidekiq::Worker

  def perform(lab_id, item_type, broadcast = true)
    lab = Lab.find(lab_id)

    lab.send(item_type.underscore.pluralize.to_sym).each do |item|
      item.__elasticsearch__.index_document

      if broadcast
        BroadcastUpdateWorker.new.perform(item_type, item.id)
      end
    end
  end

end
