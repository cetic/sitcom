module Mailchimp
  class DeleteContactWorker
    include Sidekiq::Worker

    def perform(lab_id, list_name, contact_email)
      if contact_email.present?
        lab     = Lab.find(lab_id)
        service = ContactsService.new(lab)
        list_id = service.list_id_from_name(list_name)

        service.delete_contact_from_list(list_id, contact_email)
      end
    end
  end
end
