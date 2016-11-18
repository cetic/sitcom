class ContactExport < BaseExport

  def fields
    list = {
      'Prénom'          => :first_name,
      'Nom'             => :last_name,
      'Email'           => :email,
      'Adresse (rue)'   => :address_street,
      'Adresse (code)'  => :address_zip_code,
      'Adresse (ville)' => :address_city,
      'Adresse (pays)'  => :address_country,
      'Téléphone'       => :phone,

      'Actif' => lambda { |item| item.active? ? 'Oui' : 'Non' },

      'Twitter'   => :twitter_url,
      'LinkedIn'  => :linkedin_url,
      'Facebook'  => :facebook_url,
    }

    custom_fields = lab.custom_fields.where(:item_type => 'Contact')

    custom_fields.each do |custom_field|
      list[custom_field.name] = lambda do |item|
        item.custom_fields.detect { |f| f.name == custom_field.name }.try(:value)
      end
    end

    list = list.merge({
      'Organisations'   => lambda { |item| item.organizations.collect(&:name).join(', ') },
      "Expertises"      => lambda { |item| item.fields.collect(&:name).join(', ') },
      'Évènements'      => lambda { |item| item.events.collect(&:name).join(', ') },
      'Projets'         => lambda { |item| item.projects.collect(&:name).join(', ') },
      'Notes publiques' => lambda { |item| item.notes.collect(&:text).join(', ') }
    })

    list
  end

end
