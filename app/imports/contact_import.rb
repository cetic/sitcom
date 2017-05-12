class ContactImport

  class Row < Struct.new(:first_name, :last_name, :email)
  end

  def initialize(lab, csv_data = '')
    @lab      = lab
    @csv_data = csv_data
  end

  def rows
    return @rows if defined?(@rows)

    @rows  = []

    CSV.parse(@csv_data, :col_sep => ';', :headers => true) do |csv_row|
      rows << ContactImport::Row.new(
        csv_row[0],
        csv_row[1],
        csv_row[2]
      )
    end

    @rows
  end

  def commit
    rows.each do |row|
      @lab.contacts.create!({
        :first_name => row.first_name,
        :last_name  => row.last_name,
        :email      => row.email,
      })
    end
  end
end
