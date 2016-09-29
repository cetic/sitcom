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
        item.custom_field_value(custom_field).to_s
      end
    end

    list = list.merge({
      'Organisations'        => lambda { |item| item.organizations.pluck(:name).join(', ') },
      "Domaines d'expertise" => lambda { |item| item.fields.pluck(:name).join(', ') },
      'Évènements'           => lambda { |item| item.events.pluck(:name).join(', ') },
      'Projets'              => lambda { |item| item.projects.pluck(:name).join(', ') },
      'Notes publiques'      => lambda { |item| item.notes.pluck(:text).join(', ') }
    })

    list
  end

end
