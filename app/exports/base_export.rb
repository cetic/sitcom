class BaseExport

  attr_accessor :lab, :items

  def initialize(lab, items)
    @lab   = lab
    @items = items
  end

  def xlsx_data
    workbook  = RubyXL::Workbook.new
    worksheet = workbook.worksheets[0]

    worksheet.sheet_name = self.class::SHEET_NAME

    fields.keys.each.with_index do |header, y|
      worksheet.add_cell(0, y, header)
    end

    items.each.with_index(1) do |item, x|
      fields.values.each.with_index do |field_or_lambda, y|
        value = if field_or_lambda.is_a?(Symbol)
                  item.send(field_or_lambda)
                else
                  field_or_lambda.call(item)
                end

        worksheet.add_cell(x, y, value)
      end
    end

    return workbook.stream.string
  end

  def csv_data
    CSV.generate(:col_sep => "\t") do |csv|
      csv << fields.keys

      items.each do |item|
        row = fields.values.collect do |field_or_lambda|
          if field_or_lambda.is_a?(Symbol)
            item.send(field_or_lambda)
          else
            field_or_lambda.call(item)
          end
        end

        csv << row
      end
    end
  end

end
