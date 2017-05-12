module CustomFieldsConcern
  extend ActiveSupport::Concern

  def custom_field_value(custom_field)
    custom_field_link = custom_field_links.where(:custom_field_id => custom_field.id).first

    if custom_field.field_type.bool?
      custom_field_link.try(:bool_value) || false
    else
      custom_field_link.try(:text_value).to_s
    end
  end

  def custom_fields_as_json
    lab.custom_fields.where(item_type: self.class.name).collect do |custom_field|
      field_value = custom_field_value(custom_field).to_s
      # ES cannot index booleans here

      custom_field_data = {
        :id          => custom_field.id,
        :name        => custom_field.name,
        :field_type  => custom_field.field_type,
        :value       => field_value,
        :raw_value   => field_value
      }

      if custom_field.field_type.enum?
        custom_field_data[:options] = custom_field.options
      end

      custom_field_data
    end
  end

end
