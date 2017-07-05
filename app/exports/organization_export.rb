class OrganizationExport < BaseExport

  def fields
    {
      'Nom'         => :name,
      'Statut'      => :status,
      'Description' => :description,
      'Site Web'    => :website_url,

      'Contacts'        => lambda { |item| item.contact_links.collect { |link| link.contact.name }.join(', ') },
      'Évènements'      => lambda { |item| item.event_links.collect   { |link| link.event.name   }.join(', ') },
      'Projets'         => lambda { |item| item.project_links.collect { |link| link.project.name }.join(', ') },
      'Notes publiques' => lambda { |item| item.notes.collect(&:text).join(', ')    }
    }
  end

end
