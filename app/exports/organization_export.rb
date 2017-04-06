class OrganizationExport < BaseExport

  def fields
    {
      'Nom'         => :name,
      'Statut'      => :status,
      'Description' => :description,
      'Site Web'    => :website_url,

      'Contacts'        => lambda { |item| item.contacts.colletct(:name).join(', ') },
      'Évènements'      => lambda { |item| item.events.collect(&:name).join(', ')   },
      'Projets'         => lambda { |item| item.projects.collect(&:name).join(', ') },
      'Notes publiques' => lambda { |item| item.notes.colletct(:text).join(', ')    }
    }
  end

end
