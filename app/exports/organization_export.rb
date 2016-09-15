class OrganizationExport < BaseExport

  def fields
    {
      'Nom'         => :name,
      'Statut'      => :status,
      'Description' => :description,
      'Site Web'    => :website_url,

      'Contacts'        => lambda { |item| item.contacts.pluck(:name).join(', ') },
      'Notes publiques' => lambda { |item| item.notes.pluck(:text).join(', ') }
    }
  end

end
