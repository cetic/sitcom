# encoding: utf-8

class LogoUploader < BasePublicUploader
  def extension_white_list
    %w(png)
  end

  version :preview do
    process :resize_to_fit => [400, 200]
  end
end
