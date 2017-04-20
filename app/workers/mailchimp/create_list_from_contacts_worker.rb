module Mailchimp
  class CreateListFromContactsWorker
    include Sidekiq::Worker

    def perform(lab_id, list_name, contact_ids)
      lab      = Lab.find(lab_id)
      contacts = lab.contacts.where(:id => contact_ids)

      CreateListFromContactsService.new(lab).perform(
        list_name: list_name.strip,
        contacts:  contacts
      )
    end
  end
end
