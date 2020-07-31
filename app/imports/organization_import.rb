class OrganizationImport < BaseImport

  COLUMNS = {
    :name           => 'Nom',
    :status         => 'Statut',
    :description    => 'Description',
    :website_url    => 'Site Web',
    :company_number => 'Numéro d\'entreprise',
    :address1       => 'Adresse',
    :address2       => 'Adresse (suite)',
    :city           => 'Ville',
    :state          => 'Etat/province',
    :zip            => 'Code postal',
    :country        => 'Pays',
    :twitter_url    => 'URL Twitter',
    :facebook_url   => 'URL Facebook',
    :linkedin_url   => 'URL LinkedIn',
  }

  class Row < Struct.new(*([:lab, :duplicate] + COLUMNS.keys))
  end

  attr_reader :rows, :errors

  def duplicate?(row)
    @lab.organizations.where(:name => row.name.to_s.strip).any?
  end

  def commit
    rows.each do |row|
      organization = @lab.organizations.new

      COLUMNS.keys.each do |column|
        organization.send("#{column}=".to_sym, row.send(column.to_sym))
      end

      organization.save
    end
  end
end
