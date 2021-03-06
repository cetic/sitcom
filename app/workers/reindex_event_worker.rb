class ReindexEventWorker

  include Sidekiq::Worker

  def perform(id, action = 'update', contact_ids = [], organization_ids = [], project_ids = [])
    if action == 'update'
      event = Event.find(id)

      event.__elasticsearch__.index_document
      event.contacts.import
      event.organizations.import
      event.projects.import
    elsif action == 'delete'
      index_name = Event.__elasticsearch__.index_name
      Event.__elasticsearch__.client.delete :index => index_name, :id => id

      Contact.where(:id => contact_ids).import
      Organization.where(:id => organization_ids).import
      Project.where(:id => project_ids).import
    end
  end
end
