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
        project.send("#{column}=".to_sym, row.send(column.to_sym))
      end

      project.save
    end
  end
end
