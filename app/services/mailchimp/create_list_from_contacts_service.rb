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
            upsert_contact_to_list(list['id'], contact)
          end
        end
      end
    end

    def retrieve_lists
      gibbon.lists.retrieve
    end

    def sitcom_list_id
      list_id_from_name('SITCOM')
    end

    def list_id_from_name(list_name)
      retrieve_lists.body['lists'].select { |list| list['name'] == list_name }.first['id']
    end

    def upsert_contact_to_list(list_id, contact)
      begin
        response = gibbon.lists(list_id).members(self.class.hashed(contact.email)).upsert({
          :body => {
            'email_address' => contact.email.strip,
            'status'        => 'subscribed',

            'merge_fields' => {
              'FNAME' => contact.first_name.to_s.strip,
              'LNAME' => contact.last_name.to_s.strip,
              'ADSTR' => contact.address_street.to_s.strip,
              'ADZIP' => contact.address_zip_code.to_s.strip,
              'ADCIT' => contact.address_city.to_s.strip,
              'ADCOU' => contact.address_country.to_s.strip,
              'PHONE' => contact.phone.to_s.strip,
              'ACTIV' => contact.active.to_s,
              'TWITT' => contact.twitter_url.to_s.strip,
              'LINKE' => contact.linkedin_url.to_s.strip,
              'FACEB' => contact.facebook_url.to_s.strip,
              'ORGAN' => contact.organizations.collect(&:name).join(' | '),
              'PROJE' => contact.projects.collect(&:name).join(' | '),
              'EVENT' => contact.events.collect(&:name).join(' | '),
              'TAGSS' => contact.tags.collect(&:name).join(' | ')
            }
          }
        })

        text = "#{contact.name} - #{contact.email} succeed"
        puts text
        Rails.logger.error text

        return response.body
      rescue Gibbon::MailChimpError => exception
        text = "#{contact.name} - #{contact.email} failed because of #{exception.detail}"
        puts text
        Rails.logger.error text
      end
    end

    private

    def create_list(list_name)
      # Create list
      response = gibbon.lists.create(
        :body => {
          'name'                => list_name,
          'contact'             => lab_mailchimp_contact,
          'campaign_defaults'   => lab_mailchimp_campaign_defaults,
          'permission_reminder' => lab_mailchimp_permission_reminder,
          'email_type_option'   => false
        }
      )

      # Create (merge) fields
      {
        'address_street'   => 'ADSTR',
        'address_zip_code' => 'ADZIP',
        'address_city'     => 'ADCIT',
        'address_country'  => 'ADCOU',
        'phone'            => 'PHONE',
        'active'           => 'ACTIV',
        'twitter_url'      => 'TWITT',
        'linkedin_url'     => 'LINKE',
        'facebook_url'     => 'FACEB',
        'organizations'    => 'ORGAN',
        'projects'         => 'PROJE',
        'events'           => 'EVENT',
        'tags'             => 'TAGSS'
      }.each do |name, tag|
        gibbon.lists(response.body[('id')]).merge_fields.create({
          :body => {
            :tag  => tag,
            :name => name,
            :type => 'text'
          }
        })
      end

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
