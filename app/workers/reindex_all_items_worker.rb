class ReindexAllItemsWorker

  include Sidekiq::Worker

  def perform(lab_id, item_type)
    lab = Lab.find(lab_id)

    lab.send(item_type.underscore.pluralize.to_sym).each do |item|
      item.__elasticsearch__.index_document
    end
  end

end
