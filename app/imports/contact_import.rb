class ContactImport

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

  attr_reader :rows, :errors

  def initialize(lab, csv_data = '')
    @lab      = lab
    @csv_data = csv_data
    @errors   = Set.new
  end

  def parse
    return if defined?(@rows)

    @rows  = []

    begin
      CSV.parse(@csv_data, :col_sep => ',', :headers => true) do |csv_row|
        row_hash = csv_row.to_hash
        row      = Row.new
        row.lab  = @lab

        row_hash.each_pair do |column_name, value|
          unless column_name.nil?
            attr_name = COLUMNS.key(column_name)

            if attr_name.nil?
              @errors << "Colonne inconnue : \"#{column_name}\". Ligne: #{csv_row}"
            else
              row.send("#{attr_name}=", value)
            end
          end
        end

        row.duplicate = @lab.contacts.where(
          :first_name => row.first_name.to_s.strip,
          :last_name  => row.last_name.to_s.strip
        ).any?

        rows << row
      end
    rescue ArgumentError
      @errors << "Impossible de traiter ce fichier. Est-il bien au format CSV avec encodage UTF-8 ?"
    end

    return self
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
