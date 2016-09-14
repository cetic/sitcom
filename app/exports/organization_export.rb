class OrganizationExport < BaseExport

  def fields
    {
      'Nom'         => :name,
      'Statut'      => :status,
      'Description' => :description,
      'Site Web'    => :website_url
    }
  end

end
