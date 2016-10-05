Rails.application.configure do
  config.react.addons         = true
  config.react.camelize_props = true

  if Rails.env.production? || Rails.env.cetic?
    config.react.variant = :production
  else
    config.react.variant = :development
  end
end
