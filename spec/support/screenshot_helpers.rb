module ScreenshotHelpers
  # screenshots are in tmp/capybara
  def custom_screenshot
    Capybara.current_session.current_window.resize_to(1280, 800)

    filename = "screenshot-#{UUIDTools::UUID.random_create.to_s}.png"
    page.save_screenshot(filename)
    `open tmp/capybara/#{filename}`
  end
end

# Save a screenshot after each failed JS test
RSpec.configure do |config|
  config.after(:each, :js => :true) do |x|
    if x.exception
      name = x.location.split('/').last.gsub(':', '-') + ' - ' + Time.now.to_s

      page.save_screenshot("#{name}.png")
      save_page("#{name}.html")

      puts "\nFailed test visuals saved at #{name}.{png|html}"

      # Remove files older than 31 days
      Dir.glob(Rails.root.join("tmp/capybara/*")).each do |filename|
        if (Time.now - File.ctime(filename))/(24*3600) > 31
          File.delete(filename)
        end
      end
    end
  end
end
