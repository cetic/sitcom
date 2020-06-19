module CommonItemTypeMethodsConcern
  extend ActiveSupport::Concern

  def sanitize_url(url, platform = :none)
    url = url.to_s.strip

    if url != ''
      # username management
      if !url.include?('/')
        if platform == :twitter
          url = "https://twitter.com/#{url}"
        elsif platform == :facebook
          url = "https://facebook.com/#{url}"
        elsif platform == :linkedin
          url = "https://linkedin.com/in/#{url}"
        end
      end

      # add missing http if needed
      if !url.starts_with?('https://') && !url.starts_with?('http://')
        url = "http://#{url}"
      end
    end

    url
  end
end
