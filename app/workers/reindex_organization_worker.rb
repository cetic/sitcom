class ReindexOrganizationWorker

  include Sidekiq::Worker

  def perform(id, action = 'update', contact_ids = [], project_ids = [], event_ids = [])
    if action == 'update'
      organization = Organization.find(id)

      organization.__elasticsearch__.index_document
      organization.contacts.import
      organization.projects.import
      organization.events.import
    elsif action == 'delete'
      index_name = Organization.__elasticsearch__.index_name
      Organization.__elasticsearch__.client.delete :index => index_name, :id => id

      Contact.where(:id => contact_ids).import
      Project.where(:id => project_ids).import
      Event.where(:id => event_ids).import
    end
  end
end
