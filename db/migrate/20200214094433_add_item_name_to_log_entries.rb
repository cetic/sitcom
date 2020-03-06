class AddItemNameToLogEntries < ActiveRecord::Migration[6.0]

  def change
    add_column :log_entries, :item_name, :string, :default => '',
                                                  :after   => :item_id

    reversible do |dir|
      dir.up do
        LogEntry.find_each do |log_entry|
          if log_entry.item.present?
            log_entry.update(:item_name => log_entry.item.name)
          end
        end
      end
    end
  end

end
