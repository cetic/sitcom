namespace :app do
  task :bootstrap => :environment do

    aurels  = User.find_by_email('aurelien@phonoid.com')
    michael = User.find_by_email('michael.hoste@gmail.com')
    nicolas = User.find_by_email('nicolas.devos@cetic.be')

    # Labs

    gastro = Lab.create(:name => 'Smart Gastronomy')
    health = Lab.create(:name => 'e-Health')

    aurels.labs << gastro
    aurels.labs << health

    michael.labs << gastro
    michael.labs << health

    nicolas.labs << gastro
    nicolas.labs << health

    # Contacts

    gastro.contacts.create!(:active => true,  :first_name => "John",      :last_name => "Doe")
    gastro.contacts.create!(:active => true,  :first_name => "Thomas",    :last_name => "Deblock")
    gastro.contacts.create!(:active => true,  :first_name => "Stéphanie", :last_name => "Debloc")
    gastro.contacts.create!(:active => false, :first_name => "Thomas",    :last_name => "Carly")

    # Organizations

    gastro.organizations.create!(name: "CETIC")
    gastro.organizations.create!(name: "Creative Wallonia")
    gastro.organizations.create!(name: "80LIMIT")
    gastro.organizations.create!(name: "Phonoid")
  end
end
