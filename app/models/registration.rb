class Registration
  include ActiveAttr::Attributes
  include ActiveAttr::BasicModel
  include ActiveAttr::MassAssignment

  # CONSTANTS

  USER_ATTRS = %i(name email password password_confirmation)
  LAB_ATTRS  = %i(name vat_number address1 address2 city state zip country)

  # Attributes

  USER_ATTRS.each do |attr|
    attribute attr
  end

  LAB_ATTRS.each do |attr|
    attribute "lab_#{attr}"
  end

  # Validations

  validates :name, :presence => { :message => "Veuillez entrer le nom de l'utilisateur." }

  validates :email, :presence => { :message => "Veuillez entrer l'email de l'utilisateur." },
                    :format   => { :message => "L'email que vous avez entré est invalide.",
                                   :with => Devise.email_regexp,
                                   :allow_blank => true }

  validate :validates_email_not_taken

  def validates_email_not_taken
    unless self.email.blank?
      if User.where(:email => self.email).any?
        self.errors.add(:email, "L'email que vous avez entré est déjà utilisé par une autre personne.")
      end
    end
  end

  validates :password, :presence     => { :message => "Veuillez choisir un mot de passe pour l'utilisateur." },
                       :confirmation => { :message => "Le mot de passe et sa confirmation ne correspondent pas." }
                       # Devise.password_length

  validates :password, :length => {
                         :within  => Devise.password_length,
                         :message => "Le mot de passe est trop court (minimum #{Devise.password_length.min} catactères, maximum #{Devise.password_length.max} catactères)."
                       },
                       :allow_blank => true

  validates :lab_name,     :presence => { :message => "Veuillez entrer le nom du compte."         }
  validates :lab_address1, :presence => { :message => "Veuillez entrer l'adresse du compte."      }
  validates :lab_city,     :presence => { :message => "Veuillez entrer la localité du compte."    }
  validates :lab_zip,      :presence => { :message => "Veuillez entrer le code postal du compte." }
  validates :lab_country,  :presence => { :message => "Veuillez entrer le pays du compte."        }

  # Methods

  def save
    if valid?
      lab_attributes = LAB_ATTRS.map do |attr|
        [attr, attributes["lab_#{attr}"]]
      end.to_h

      user_attributes = USER_ATTRS.map do |attr|
        [attr, attributes[attr.to_s]]
      end.to_h

      lab = Lab.create!(lab_attributes.merge({
        :mailchimp_company  => lab_name,
        :mailchimp_address1 => lab_address1,
        :mailchimp_address2 => lab_address2,
        :mailchimp_city     => lab_city,
        :mailchimp_state    => lab_state,
        :mailchimp_zip      => lab_zip,
        :mailchimp_country  => lab_country
      }))

      user = User.create!(user_attributes.merge({
        :lab_ids     => [lab.id],
        :lab_manager => true
      }))

      unless Rails.env.test?
        ApplicationMailer.lab_created(lab, user).deliver_now
      end

      true
    else
      false
    end
  end
end
