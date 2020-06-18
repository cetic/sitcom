class SanitizeUrls < ActiveRecord::Migration[6.0]
  def change
    # Duplicate from 2018 and break name validation
    Organization.where(:id => 197, :name => 'MobilESEM').first.destroy!

    Contact.find_each { |contact| puts(contact.name); contact.save! }
    Organization.find_each { |organization| puts(organization.name); organization.save! }
    Event.find_each { |event| puts(event.name); event.save! }
  end
end
