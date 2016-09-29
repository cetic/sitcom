class BroadcastUpdateWorker
  include Sidekiq::Worker

  def perform(class_name, id)
    item = class_name.constantize.find(id)

    ActionCable.server.broadcast(item.channel_name, {
      :action => 'update',
      :item   => item.as_indexed_json
    })
  end
end
