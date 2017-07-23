module Mailchimp
  class UpsertContactWorker
    include Sidekiq::Worker

    def perform(lab_id, list_name, contact_id)
      lab     = Lab.find(lab_id)
      contact = lab.contacts.where(:id => contact_id).first
      list_id = Mailchimp::CreateListFromContactsService.list_id_from_name(list_name)

      CreateListFromContactsService.new(lab).upsert_contact_to_list(list_id, contact)
    end
  end
end
