class ReindexContactWorker

  include Sidekiq::Worker

  def perform(id, action = 'update', organization_ids = [], project_ids = [], event_ids = [])
    if action == 'update'
      contact = Contact.find(id)

      contact.__elasticsearch__.index_document
      contact.organizations.import
      contact.projects.import
      contact.events.import
    elsif action == 'delete'
      index_name = Contact.__elasticsearch__.index_name
      Contact.__elasticsearch__.client.delete :index => index_name, :id => id

      Organization.where(:id => organization_ids).import
      Project.where(:id => project_ids).import
      Event.where(:id => event_ids).import
    end
  end

end
