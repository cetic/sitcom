class ProjectImport < BaseImport

  COLUMNS = {
    :name        => 'Nom',
    :description => 'Description',
    :start_date  => 'Date de début',
    :end_date    => 'Date de fin',
  }

  class Row < Struct.new(*([:lab, :duplicate] + COLUMNS.keys))
  end

  attr_reader :rows, :errors

  def duplicate?(row)
    @lab.projects.where(:name => row.name.to_s.strip).any?
  end

  def commit
    rows.each do |row|
      project = @lab.projects.new

      COLUMNS.keys.each do |column|
        if column == :start_date || column == :end_date
          # parsed_date = Date.strptime(row.send(column.to_sym), "%d/%m/%y")
          date = row.send(column.to_sym)
          project.send("#{column}=".to_sym, date)
        else
          project.send("#{column}=".to_sym, row.send(column.to_sym))
        end
      end

      project.save
    end
  end
end
