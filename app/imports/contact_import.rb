class ContactImport

  COLUMNS = {
    :first_name       => 'Prénom',
    :last_name        => 'Nom',
    :email            => 'Email',
    :address_street   => 'Adresse (rue)',
    :address_zip_code => 'Adresse (code postal)',
    :address_city     => 'Adresse (ville)',
    :address_country  => 'Adresse (pays)',
    :phone            => 'Téléphone',
    :twitter_url      => 'Twitter (URL)',
    :linkedin_url     => 'LinkedIn (URL)',
    :facebook_url     => 'Facebook (URL)',
  }

  class Row < Struct.new(*COLUMNS.keys); end

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

        row_hash.each_pair do |column_name, value|
          attr_name = COLUMNS.key(column_name)

          if attr_name.nil?
            @errors << "Colonne inconnue: \"#{column_name}\""
          else
            row.send("#{attr_name}=", value)
          end
        end

        rows << row
      end
    rescue ArgumentError
      @errors << "Impossible de traiter ce fichier. Est-il bien au format CSV ?"
    end

    return self
  end

  def commit
    rows.each do |row|
      contact = @lab.contacts.new

      COLUMNS.keys.each do |column|
        contact.send("#{column}=".to_sym, row.send(column.to_sym))
      end

      contact.save!
    end
  end
end
