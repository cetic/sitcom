class ReindexProjectWorker

  include Sidekiq::Worker

  def perform(id, action = 'update', contact_ids = [], organization_ids = [], event_ids = [])
    if action == 'update'
      project = Project.find(id)

      project.__elasticsearch__.index_document
      project.contacts.import
      project.organizations.import
      project.events.import
    elsif action == 'delete'
      index_name = Project.__elasticsearch__.index_name
      Project.__elasticsearch__.client.delete :index => index_name, :id => id

      Contact.where(:id => contact_ids).import
      Organization.where(:id => organization_ids).import
      Event.where(:id => event_ids).import
    end
  end
end
