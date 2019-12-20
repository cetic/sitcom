class ContactImport < BaseImport

  COLUMNS = {
    :first_name       => 'Prénom',
    :last_name        => 'Nom',
    :email            => 'Email',
    :organization     => 'Organisation',
    :address_street   => 'Adresse (rue)',
    :address_zip_code => 'Adresse (code postal)',
    :address_city     => 'Adresse (ville)',
    :address_country  => 'Adresse (pays)',
    :phone            => 'Téléphone',
    :twitter_url      => 'Twitter (URL)',
    :linkedin_url     => 'LinkedIn (URL)',
    :facebook_url     => 'Facebook (URL)',
  }

  class Row < Struct.new(*([:lab, :duplicate] + COLUMNS.keys))
    def linked_organization_found?
      linked_organization.present?
    end

    def linked_organization
      lab.organizations.find_by(:name => organization)
    end
  end

  def duplicate?(row)
    @lab.contacts.where(
      :first_name => row.first_name.to_s.strip,
      :last_name  => row.last_name.to_s.strip
    ).any?
  end

  def commit
    rows.each do |row|
      contact = @lab.contacts.new

      COLUMNS.keys.each do |column|
        if column == :organization
          if row.linked_organization_found?
            contact.organizations << row.linked_organization
          end
        else
          contact.send("#{column}=".to_sym, row.send(column.to_sym))
        end
      end

      contact.save
    end
  end
end
