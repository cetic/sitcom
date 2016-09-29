class BroadcastDestroyWorker
  include Sidekiq::Worker

  def perform(channel_name, item_id)
    ActionCable.server.broadcast(channel_name, {
      :action  => 'destroy',
      :item_id => item_id
    })
  end
end
