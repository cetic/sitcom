class LinkFieldsToLabs < ActiveRecord::Migration[5.0]
  def up
    existing_fields_tree = Field.where(parent_id: nil).collect do |field|
      OpenStruct.new({
        name:     field.name,
        children: field.children.pluck(:name)
      })
    end

    add_reference :fields, :lab, after: :id

    Field.reset_column_information

    Lab.all.each do |lab|
      existing_fields_tree.each do |existing_root_field|
        puts existing_root_field.name

        root_field = lab.fields.create!(
          name: existing_root_field.name
        )

        existing_root_field.children.each do |child_field_name|
          puts "\t#{child_field_name}"

          root_field.children.create!(
            lab:  lab,
            name: child_field_name
          )
        end
      end
    end

    Field.where(lab_id: nil).destroy_all
  end

  def down
    Field.where.not(lab_id: nil).destroy_all
    remove_reference :fields, :lab
  end
end
