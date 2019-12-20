class BaseImport

  attr_reader :rows, :errors

  def initialize(lab, xlsx_data = '')
    @lab       = lab
    @xlsx_data = xlsx_data
    @errors    = Set.new
  end

  def parse
    return if defined?(@rows)

    begin
      workbook  = RubyXL::Parser.parse_buffer(@xlsx_data)
      worksheet = workbook.worksheets[0]

      j       = 0
      headers = []

      loop do
        h = worksheet[0][j]

        break if h.nil?

        headers << h.value

        j += 1
      end

      i     = 1
      @rows = []

      loop do
        break if worksheet[i].nil?

        row      = self.class::Row.new
        row.lab  = @lab
        j        = 0

        loop do
          break if j >= headers.size

          value       = worksheet[i][j]&.value
          column_name = headers[j]
          attr_name   = self.class::COLUMNS.key(column_name)

          if attr_name.nil?
            @errors << "Colonne inconnue : \"#{column_name}\". Ligne: #{i}"
          else
            row.send("#{attr_name}=", value)
          end

          j += 1
        end

        row.duplicate = duplicate?(row)

        @rows << row

        i += 1
      end
    rescue StandardError => e
      @errors << "Impossible de traiter ce fichier. Est-il bien au format XLSx ?"
      @errors << "Détails techniques: \"#{e.message}\""
    end

    return self
  end
end
