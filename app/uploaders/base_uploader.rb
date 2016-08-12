class BaseUploader < CarrierWave::Uploader::Base
  include CarrierWave::RMagick

  storage :file

  VERY_LARGE = 100_000

  def cache_dir
    'system/tmp/carrierwave'
  end
end
