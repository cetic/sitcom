module GravatarConcern
  extend ActiveSupport::Concern

  def picture_url(size = nil)
    if picture.present? # carrierwave
      if size
        picture.url(size)
      else
        picture.url
      end
    else # gravatar
      if size == :thumb
        size = 100
      elsif size == :preview
        size = 200
      else
        size == 200
      end

      hashable = (defined?(self.email) && self.email.present?) ? self.email : self.name

      gravatar_id = Digest::MD5.hexdigest(hashable.downcase)
      "https://gravatar.com/avatar/#{gravatar_id}.png?s=#{size}&d=retro"
    end
  end
end
