# Mailchimp::CreateListFromContactsService.new(Lab.first).create_list_from_contacts("bonsoir",  Lab.first.contacts.where(id: 148))
# Mailchimp::CreateListFromContactsService.new(Lab.first).create_list("bonsoir")

module Mailchimp
  class CreateListFromContactsService

    attr_reader :lab, :gibbon

    def initialize(lab)
      @lab    = lab
      @gibbon = Gibbon::Request.new(:api_key => @lab.mailchimp_api_key)
    end

    def perform(list_name:, contacts:)
      if lab.mailchimp_configured?
        list = create_list(list_name)

        contacts.each do |contact|
          if contact.email.present?
            subscribe_contact_to_list(list['id'], contact)
          end
        end
      end
    end

    private

    def create_list(list_name)
      response = gibbon.lists.create(
        :body => {
          'name'                => list_name,
          'contact'             => lab_mailchimp_contact,
          'campaign_defaults'   => lab_mailchimp_campaign_defaults,
          'permission_reminder' => lab_mailchimp_permission_reminder,
          'email_type_option'   => false
        }
      )

      response.body
    end

    def subscribe_contact_to_list(list_id, contact)
      response = gibbon.lists(list_id).members(self.class.hashed(contact.email)).upsert({
        :body => {
          'email_address' => contact.email.strip,
          'status'        => 'subscribed',

          'merge_fields' => {
            'FNAME' => contact.first_name.to_s.strip,
            'LNAME' => contact.last_name.to_s.strip,
          }
        }
      })

      response.body
    end

    def lab_mailchimp_contact
      {
        'company'  => lab.mailchimp_company,
        'address1' => lab.mailchimp_address1,
        'address2' => lab.mailchimp_address2,
        'city'     => lab.mailchimp_city,
        'state'    => lab.mailchimp_state,
        'zip'      => lab.mailchimp_zip,
        'country'  => lab.mailchimp_country,
      }
    end

    def lab_mailchimp_campaign_defaults
      {
        'from_name'  => lab.mailchimp_company,
        'from_email' => lab.mailchimp_from_email,
        'subject'    => '',
        'language'   => 'fr'
      }
    end

    def lab_mailchimp_permission_reminder
      "You are receiving this email, because you subscribed our product."
    end

    class << self
      def hashed(string)
        md5 = Digest::MD5.new
        md5.update(string.downcase.strip)
        md5.hexdigest
      end
    end

  end
end
