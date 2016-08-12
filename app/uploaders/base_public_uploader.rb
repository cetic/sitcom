class BasePublicUploader < BaseUploader
  def store_dir
    "#{Rails.root}/public/system/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end
end
