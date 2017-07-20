class AddFileToDocuments < ActiveRecord::Migration[5.0]
  def change
    add_column :documents, :file, :string, :after => :uploadable_type
  end
end
