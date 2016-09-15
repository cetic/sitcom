class ContactExport < BaseExport

  def fields
    {
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

      'Organisations'        => lambda { |item| item.organizations.pluck(:name).join(', ') },
      "Domaines d'expertise" => lambda { |item| item.fields.pluck(:name).join(', ') },
      'Évènements'           => lambda { |item| item.events.pluck(:name).join(', ') },
      'Projets'              => lambda { |item| item.projects.pluck(:name).join(', ') },
      'Notes publiques'      => lambda { |item| item.notes.pluck(:text).join(', ') }
    }
  end

end
