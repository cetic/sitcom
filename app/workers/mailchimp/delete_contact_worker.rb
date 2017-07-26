module Mailchimp
  class DeleteContactWorker
    include Sidekiq::Worker

    def perform(lab_id, list_name, contact_email)
      lab     = Lab.find(lab_id)
      list_id = Mailchimp::ContactsService.list_id_from_name(list_name)

      ContactsService.new(lab).delete_contact_from_list(
        list_id,
        contact_email
      )
    end
  end
end
