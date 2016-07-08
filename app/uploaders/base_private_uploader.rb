# encoding: utf-8

class BasePrivateUploader < CarrierWave::Uploader::Base
  include CarrierWave::RMagick

  storage :file

  VERY_LARGE = 100_000

  def store_dir
    "#{Rails.root}/private/system/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  def cache_dir
    "system/tmp/carrierwave"
  end
end
