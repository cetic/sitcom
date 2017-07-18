class EventImport

  COLUMNS = {
    :name        => 'Nom',
    :description => 'Description',
    :happens_on  => 'Date',
    :place       => 'Lieu',
    :website_url => 'Site web (URL)'
  }

  class Row < Struct.new(*([:lab, :duplicate] + COLUMNS.keys))
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
          attr_name = COLUMNS.key(column_name)

          if attr_name.nil?
            @errors << "Colonne inconnue : \"#{column_name}\""
          else
            row.send("#{attr_name}=", value)
          end
        end

        row.duplicate = @lab.events.where(:name => row.name.strip).any?

        rows << row
      end
    rescue ArgumentError
      @errors << "Impossible de traiter ce fichier. Est-il bien au format CSV ?"
    end

    return self
  end

  def commit
    rows.each do |row|
      event = @lab.events.new

      COLUMNS.keys.each do |column|
        if column == :happens_on
          parsed_date = Date.strptime(row.send(column.to_sym), "%d/%m/%y")
          event.send("#{column}=".to_sym, parsed_date)
        else
          event.send("#{column}=".to_sym, row.send(column.to_sym))
        end
      end

      event.save
    end
  end
end
