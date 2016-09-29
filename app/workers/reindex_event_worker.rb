class ReindexEventWorker

  include Sidekiq::Worker

  def perform(id, action = 'update', contact_ids = [])
    if action == 'update'
      event = Event.find(id)

      event.__elasticsearch__.index_document
      event.contacts.import
    else
      index_name = Event.__elasticsearch__.index_name
      Event.__elasticsearch__.client.delete :index => index_name, :type => 'event', :id => id

      Contact.where(:id => contact_ids).import
    end
  end
end
