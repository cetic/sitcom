class LabAccountTypeService

  # Constants

  MAX_PROJECTS = 2
  MAX_EVENTS   = 4

  # Attributes

  attr_accessor :lab

  # Methods

  def initialize(lab)
    @lab  = lab
  end

  def can_create_project?
    premium? || lab.projects.count < MAX_PROJECTS
  end

  def can_create_event?
    premium? || lab.events.count < MAX_EVENTS
  end

  def can_use_mailchimp?
    premium?
  end

  class << self
    def projects_quota_message
      "Les comptes de type basic sont limités à #{LabAccountTypeService::MAX_PROJECTS} projets maximum. #{premium_message}"
    end

    def events_quota_message
      "Les comptes de type basic sont limités à #{LabAccountTypeService::MAX_EVENTS} évènements maximum. #{premium_message}"
    end

    def premium_message
      "Passez à un compte premium pour éviter cette limitation. Contactez-nous par email à #{ENV["ADMIN_EMAIL"]} pour plus d'informations."
    end
  end

  private

  def premium?
    lab.account_type.premium?
  end

end
