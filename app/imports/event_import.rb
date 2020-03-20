class EventImport < BaseImport

  COLUMNS = {
    :name        => 'Nom',
    :description => 'Description',
    :happens_on  => 'Date',
    :place       => 'Lieu',
    :website_url => 'Site Web'
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
        event.send("#{column}=".to_sym, row.send(column.to_sym))
      end

      event.save
    end
  end
end
