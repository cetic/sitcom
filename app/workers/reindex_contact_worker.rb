class ReindexContactWorker

  include Sidekiq::Worker

  def perform(id, action = 'update', organization_ids = [], event_ids = [], project_ids = [])
    if action == 'update'
      contact = Contact.find(id)

      contact.__elasticsearch__.index_document
      contact.organizations.import
      contact.projects.import
      contact.events.import
    else
      index_name = Contact.__elasticsearch__.index_name
      Contact.__elasticsearch__.client.delete :index => index_name, :type => 'contact', :id => id

      Organization.where(:id => organization_ids).import
      Project.where(:id => project_ids).import
      Event.where(:id => event_ids).import
    end
  end

end
