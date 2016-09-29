module CableActionsConcern
  extend ActiveSupport::Concern

  def channel_name
    "#{self.class.name.underscore.pluralize}_#{lab_id}"
  end

  def cable_create
    BroadcastCreateWorker.perform_async(self.class.name, id)
  end

  def cable_update
    BroadcastUpdateWorker.perform_async(self.class.name, id)
  end

  def cable_destroy
    BroadcastDestroyWorker.perform_async(channel_name, id)
  end
end
