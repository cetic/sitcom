class EventExport < BaseExport

  def fields
    list = {
      'Nom'         => :name,
      'Lieu'        => :place,
      'Description' => :description,
      'Site Web'    => :website_url,
      'Date'        => :happens_on
    }

    custom_fields = lab.custom_fields.where(:item_type => 'Event')

    custom_fields.each do |custom_field|
      list[custom_field.name] = lambda do |item|
        item.custom_fields.detect { |f| f.name == custom_field.name }.try(:value)
      end
    end

    list = list.merge({
      'Contacts'        => lambda { |item| item.contact_links.collect      { |link| link.contact.name      }.join(', ') },
      'Organisations'   => lambda { |item| item.organization_links.collect { |link| link.organization.name }.join(', ') },
      'Projets'         => lambda { |item| item.project_links.collect      { |link| link.project.name      }.join(', ') },
      'Notes publiques' => lambda { |item| item.notes.collect(&:text).join(', ')                                        }
    })

    list
  end

end
