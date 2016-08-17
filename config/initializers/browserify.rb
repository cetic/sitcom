Rails.application.config.browserify_rails.commandline_options = "-t [ babelify --presets [ es2015 react ] ]"
Rails.application.config.browserify_rails.paths = [
  -> (p) { p.start_with? Rails.root.join("app/assets/javascripts").to_s },
  -> (p) { p.start_with? Rails.root.join("node_modules").to_s }
]
