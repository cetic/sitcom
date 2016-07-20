module GravatarConcern
  extend ActiveSupport::Concern

  included do
    # Scopes, relations, validations, etc.
  end

  module ClassMethods
    # Class methods
    private
    # Private class methods (only for concern)
  end

  def gravatar_url(options = {})
    options = { :size => 50, :type => 'retro' }.merge(options)
    gravatar_id = Digest::MD5.hexdigest(self.email.downcase)
    "//gravatar.com/avatar/#{gravatar_id}.png?s=#{options[:size]}&d=#{options[:type]}"
  end
end
