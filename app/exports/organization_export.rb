class OrganizationExport < BaseExport

  def fields
    list = {
      'Nom'         => :name,
      'Statut'      => :status,
      'Description' => :description,
      'Site Web'    => :website_url
    }

    custom_fields = lab.custom_fields.where(:item_type => 'Organization')

    custom_fields.each do |custom_field|
      list[custom_field.name] = lambda do |item|
        item.custom_fields.detect { |f| f.name == custom_field.name }.try(:value)
      end
    end

    list = list.merge({
      'Contacts'        => lambda { |item| item.contact_links.collect { |link| link.contact.name             }.join(', ')  },
      'Projets'         => lambda { |item| item.project_links.collect { |link| link.project.name             }.join(', ')  },
      'Évènements'      => lambda { |item| item.event_links.collect   { |link| link.event.name               }.join(', ')  },
      'Notes publiques' => lambda { |item| item.notes.collect         { |note| "#{note.name} — #{note.text}" }.join(' | ') }
    })

    list
  end

end
