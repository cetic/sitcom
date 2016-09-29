class ReindexOrganizationWorker

  include Sidekiq::Worker

  def perform(id, action = 'update', contact_ids = [])
    if action == 'update'
      organization = Organization.find(id)

      organization.__elasticsearch__.index_document
      organization.contacts.import
    else
      index_name = Organization.__elasticsearch__.index_name
      Organization.__elasticsearch__.client.delete :index => index_name, :type => 'organization', :id => id

      Contact.where(:id => contact_ids).import
    end
  end
end
