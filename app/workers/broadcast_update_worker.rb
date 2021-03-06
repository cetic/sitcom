class BroadcastUpdateWorker
  include Sidekiq::Worker

  sidekiq_options :queue => :websockets

  def perform(class_name, id)
    item = class_name.constantize.find(id)

    ActionCable.server.broadcast(item.channel_name, {
      :action => 'update',
      :item   => BaseSearch.reject_private_notes_from_result(
                   BaseSearch.reject_private_documents_from_result(
                     item.as_indexed_json
                   )
                 )
    })
  end
end
