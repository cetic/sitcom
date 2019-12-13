FactoryBot.find_definitions

# https://github.com/stympy/faker/issues/266
Rails.application.config.i18n.available_locales += %w(en)

namespace :app do
  task :bootstrap => :environment do

    aurels  = User.find_by_email('aurelien@phonoid.com')
    michael = User.find_by_email('michael.hoste@gmail.com')
    nicolas = User.find_by_email('nicolas.devos@cetic.be')
    jules   = User.find_by_email('jules.verne@hotmail.com')

    # Labs

    gastro = Lab.create(:name => 'Smart Gastronomy Lab')
    health = Lab.create(:name => 'e-Health')

    aurels.labs << gastro
    aurels.labs << health

    michael.labs << gastro
    michael.labs << health

    nicolas.labs << gastro
    nicolas.labs << health

    jules.labs << gastro

    gastro.contacts.create!(
      first_name:         "Aurélien",
      last_name:          "Malisart",
      remote_picture_url: "http://aurelien.malisart.be/assets/images/aurelien-malisart.jpg"
    )

    # Organizations

    gastro.organizations.create!(name: "CETIC")
    gastro.organizations.create!(name: "Creative Wallonia")
    gastro.organizations.create!(name: "80LIMIT")
    gastro.organizations.create!(name: "Phonoid")

    Sidekiq::Queue.new.clear
  end

  task :bootstrap_fake => :environment do

    puts "Bootstrapping contacts"

    100.times do
      FactoryBot.create(:contact, :lab => Lab.all.to_a.sample) rescue puts "    contact name already used"
    end

    puts "Bootstrapping organizations"

    50.times do
      FactoryBot.create(:organization, :lab => Lab.all.to_a.sample) rescue puts "    organization name already used"
    end

    puts "Bootstrapping fields"

    10.times do
      field = FactoryBot.create(:field, :parent_id => nil)

      (1 + rand(6)).times do
        FactoryBot.create(:field, :parent_id => field.id) rescue puts "    field name already used"
      end
    end

    puts "Bootstrapping events"

    30.times do
      FactoryBot.create(:event, :lab => Lab.all.to_a.sample) rescue puts "    event name already used"
    end

    puts "Bootstrapping projects"

    30.times do
      FactoryBot.create(:project, :lab => Lab.all.to_a.sample) rescue puts "    project name already used"
    end

    puts "Bootstrapping notes and associations"

    notables = Contact.all.to_a + Organization.all.to_a + Event.all.to_a + Project.all.to_a

    200.times do
      FactoryBot.create(:note, :notable => notables.sample)
    end

    puts "Bootstrapping contacts-organizations associations"

    Organization.all.each do |organization|
      rand(4).times do
        organization.contacts << Contact.where(:lab_id => organization.lab_id).to_a.sample rescue puts 'contact-organization link already present, ignore it'
      end
    end

    puts "Bootstrapping contacts-events associations"

    Event.all.each do |event|
      rand(20).times do
        event.contacts << Contact.where(:lab_id => event.lab_id).to_a.sample rescue puts 'contact-event link already present, ignore it'
      end
    end

    puts "Bootstrapping contacts-projects associations"

    Project.all.each do |project|
      rand(20).times do
        project.contacts << Contact.where(:lab_id => project.lab_id).to_a.sample rescue puts 'contact-project link already present, ignore it'
      end
    end

    puts "Bootstrapping contacts-fields associations"

    fields = Field.all.to_a

    Contact.all.each do |contact|
      rand(3).times do
        contact.fields << fields.sample rescue puts 'contact-field link already present, ignore it'
      end
    end

    puts "Bootstrapping tags"

    tags = ['tag 1', 'tag 2', 'tag 3', 'tag 4', 'tag 5']

    100.times do
      ItemTagService.new(User.all.to_a.sample, Contact.all.to_a.sample).add_tag(tags.sample)
    end

    puts "Bootstrapping saved searches"

    Lab.all.each do |lab|
      ['contact', 'organization', 'project', 'event'].each do |item_type|
        ['ala', 'anne', 'aur', 'dup', 'ray'].each_with_index do |search, i|
          lab.saved_searches.create!(
            :item_type => item_type,
            :name      => "Recherche enregistrée #{i + 1}",
            :search    => "?quickSearch=#{search}"
          )
        end
      end
    end

    puts "Bootstrapping custom fields"

    Lab.all.each do |lab|
      lab.custom_fields.create!(:name => "Groupe sanguin", :field_type => :text)
      lab.custom_fields.create!(:name => "Description du business", :field_type => :text)

      lab.custom_fields.create!(:name => "Donateur", :field_type => :bool)
      lab.custom_fields.create!(:name => "Abonné mailing list", :field_type => :bool)

      lab.custom_fields.create!(:name       => "Sexe",
                                :field_type => :enum,
                                :options    => ['Homme', 'Femme'])
    end

    Sidekiq::Queue.new.clear
  end
end
