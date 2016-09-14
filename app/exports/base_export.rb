class BaseExport

  attr_accessor :items

  def initialize(items)
    @items = items
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
