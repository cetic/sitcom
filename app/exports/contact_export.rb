class ContactExport < BaseExport

  def fields
    {
      'Prénom',         => :first_name,
      'Nom',            => :last_name,
      'Email',          => :email,
      'Adresse (rue)'   => :address_street,
      'Adresse (code)'  => :address_zip_code,
      'Adresse (ville)' => :address_city,
      'Adresse (pays)'  => :address_country,
      'Téléphone',      => :phone,

      'Actif', => lambda { |item| item.active? ? 'Oui' : 'Non' },

      'Twitter',  => :twitter_url,
      'LinkedIn', => :linkedin_url,
      'Facebook'  => :facebook_url
    }
  end

end
