class EventImport < BaseImport

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

  def duplicate?(row)
    @lab.events.where(:name => row.name.to_s.strip).any?
  end

  def commit
    rows.each do |row|
      event = @lab.events.new

      COLUMNS.keys.each do |column|
        if column == :happens_on
          date = row.send(column.to_sym)
          # parsed_date = Date.strptime(row.send(column.to_sym), "%d/%m/%y")
          event.send("#{column}=".to_sym, date)
        else
          event.send("#{column}=".to_sym, row.send(column.to_sym))
        end
      end

      event.save
    end
  end
end
