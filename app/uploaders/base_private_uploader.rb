class BasePrivateUploader < BaseUploader
  def store_dir
    "#{Rails.root}/private/system/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end
end
