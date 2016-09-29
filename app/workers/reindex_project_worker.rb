class ReindexProjectWorker

  include Sidekiq::Worker

  def perform(id, action = 'update', contact_ids = [])
    if action == 'update'
      project = Project.find(id)

      project.__elasticsearch__.index_document
      project.contacts.import
    else
      index_name = Project.__elasticsearch__.index_name
      Project.__elasticsearch__.client.delete :index => index_name, :type => 'project', :id => id

      Contact.where(:id => contact_ids).import
    end
  end
end
