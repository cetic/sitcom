describe 'Basic events', :js => true, :focus => true do

  before :each do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    LabUserLink.first.update(
      :can_write_events => true
    )

    3.times do
      FactoryBot.create(:event, :lab => @lab)
    end

    Event.__elasticsearch__.refresh_index!

    login_as @user
  end

  it 'displays events sorted in listing' do
    # MySQL sort is not the same as ruby sort on accents
    Event.all.to_a.each do |event|
      event.update(
        :name => I18n.transliterate(event.name),
      )
    end

    Event.__elasticsearch__.refresh_index!

    visit lab_events_path(@lab)

    page_names = all('.event .name').collect { |span| span.text }
    db_names   = @lab.events.sort_by(&:sort_name).collect(&:name)

    page_names.should == db_names
  end

  it 'can access a specific event page (by clicking on the list) and go back to list' do
    visit lab_events_path(@lab)

    first_event = @lab.events.first

    click_link first_event.name

    page.current_path.should == "/#{@lab.slug}/events/#{first_event.id}"

    within '.item-show h1' do
      page.should have_content(first_event.name)
    end

    page.should have_content("Retour à la liste")

    click_on 'Retour à la liste'

    page.current_path.should == "/#{@lab.slug}/events"
  end

  it 'can access a specific event page (directly)' do
    event = @lab.events.to_a[1]

    visit lab_event_path(@lab, event)

    page.current_path.should == "/#{@lab.slug}/events/#{event.id}"

    within '.item-show h1' do
      page.should have_content(event.name)
    end

    page.should have_content("Retour à la liste")

    click_on 'Retour à la liste'

    page.current_path.should == "/#{@lab.slug}/events"
  end

  it 'can edit a event basic informations' do
    event = @lab.events.first

    event.update!(:happens_on => nil)

    visit lab_event_path(@lab, event)

    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      click_on 'Modifier', :wait => 3

      fill_in "Nom de l'évènement", :with => 'Boostcamp'
      fill_in "place", :with => 'Mons'
      fill_in "website", :with => 'https://boostcamp.be'
      fill_in "description", :with => 'Un nouveau départ pour votre projet'

      find('.dates .date-field a').click

      find('h1').click # close date selector

      click_on 'Enregistrer'
    end

    within '.item-show h1', :wait => 10 do
      page.should have_content('Boostcamp', :wait => 3)
    end

    event.reload

    event.name.should        == 'Boostcamp'
    event.happens_on.should  == Date.today
    event.description.should == 'Un nouveau départ pour votre projet'
    event.website_url.should == 'https://boostcamp.be'
    event.place.should       == 'Mons'
  end

  it 'can add a tag to an event' do
    event = @lab.events.first

    visit lab_event_path(@lab, event)

    within '.item-show .general' do
      find('.new-tag', :wait => 3).click
      fill_in 'Créer un nouveau tag', :with => "test tag\n"
      find('.new-tag', :wait => 3).click # close

      within '.tags' do
        page.should have_content('test tag')
      end
    end

    event.reload

    event.tags.first.name.should == 'test tag'
  end

  it 'can remove a tag from a event' do
    event = @lab.events.first

    event_tag = Tag.create(:lab => @lab, :name => 'small test', :color => '#cccccc', :item_type => 'Event')
    event.tags << event_tag

    event.tags.first.name.should == 'small test'

    visit lab_event_path(@lab, event)

    within '.tags' do
      page.should have_content('small test')
    end

    # Select first field
    within '.item-show .general' do
      find('.new-tag', :wait => 3).click
      find('.tag-item .fa-remove', :wait => 3).click
      find('.new-tag', :wait => 3).click # close

      sleep 1.0

      within '.tags', :wait => 10 do
        page.should_not have_content('small test', :wait => 10)
      end
    end

    event.reload

    event.tags.size.should == 0
  end

  it 'can add public and private notes' do
    event = @lab.events.first

    visit lab_event_path(@lab, event)

    within '.notes-block' do
      find('.col-md-6:first-child .new-note a', :wait => 10).click

      fill_in 'Titre de la note', :with => 'Une note publique', :wait => 5
      fill_in 'Contenu', :with => "Contenu d'une note publique", :wait => 5

      find('.actions .btn-primary', :wait => 5).click # Ajouter

      find('.col-md-6:last-child .new-note a', :wait => 10).click

      fill_in 'Titre de la note', :with => 'Une note privée', :wait => 5
      fill_in 'Contenu', :with => "Contenu d'une note privée", :wait => 5

      sleep 1.0

      find('.actions .btn-primary', :wait => 5).click # Ajouter

      sleep 1.0 # time to get websocket

      page.should have_content('Notes publiques (1)', :wait => 10)
      page.should have_content('Notes privées (1)',   :wait => 10)

      page.should have_content('Une note publique')
      page.should have_content("Contenu d'une note publique")

      page.should have_content('Une note privée')
      page.should have_content("Contenu d'une note privée")
    end

    event.reload

    public_note = event.notes.with_privacy(:public).first

    public_note.name.should == 'Une note publique'
    public_note.text.should == "Contenu d'une note publique"

    private_note = event.notes.with_privacy(:private).first

    private_note.name.should == 'Une note privée'
    private_note.text.should == "Contenu d'une note privée"
  end

  it 'can edit different custom fields' do
    blood_field   = @lab.custom_fields.create!(:name => "Groupe sanguin", :field_type => :text, :item_type => 'Event')
    donator_field = @lab.custom_fields.create!(:name => "Donateur", :field_type => :bool, :item_type => 'Event')
    sex_field     = @lab.custom_fields.create!({
      :name       => "Sexe",
      :field_type => :enum,
      :options    => ['Homme', 'Femme'],
      :item_type  => 'Event'
    })

    event = @lab.events.first

    visit lab_event_path(@lab, event)

    within '.custom-fields-block' do
      # Groupe sanguin
      find('.col-md-6:first-child button').click
      find('.col-md-6:first-child textarea', :wait => 3).set('A Négatif')
      find('.col-md-6:first-child button', :wait => 3).click

      # Donateur
      find('.col-md-6:nth-child(2) button', :wait => 3).click
      find('.col-md-6:nth-child(2) input:first-child', :wait => 3).set(true) # select "oui"
      find('.col-md-6:nth-child(2) button', :wait => 3).click

      # Sexe
      find('.col-md-6:nth-child(3) button', :wait => 3).click
      find('.Select-placeholder', :wait => 3).click
      find('.Select-option[aria-label=  "Femme"]').click
      find('.col-md-6:nth-child(3) button', :wait => 3).click

      sleep 0.2

      page.should have_content('A Négatif', :wait => 10)
      page.should have_content('Oui',       :wait => 10)
      page.should have_content('Femme',     :wait => 10)
    end

    event.reload

    event.custom_field_links.where(:custom_field => blood_field).first.text_value.should   == 'A Négatif'
    event.custom_field_links.where(:custom_field => donator_field).first.bool_value.should == true
    event.custom_field_links.where(:custom_field => sex_field).first.text_value.should     == 'Femme'
  end

  it 'can add a contact to events and the contact role' do
    contact = FactoryBot.create(:contact, :lab => @lab)

    Contact.__elasticsearch__.refresh_index!

    event = @lab.events.first

    visit lab_event_path(@lab, event)

    within '.contacts-block' do
      page.should have_content("Aucun contact.")

      # Select first contact
      find('.Select-placeholder', :wait => 3).click
      find('.Select-menu-outer', :wait => 3).click

      page.should have_content(contact.name)

      find('h4').hover

      click_on 'Modifier le rôle', :wait => 5
      fill_in 'role', :with => "Prestataire\n"

      sleep 1.0
    end

    event.reload

    event.contacts.should == [contact]
    event.contact_event_links.first.role.should == 'Prestataire'
  end

  it 'can add an organization to events' do
    organization = FactoryBot.create(:organization, :lab => @lab)

    Organization.__elasticsearch__.refresh_index!

    event = @lab.events.first

    visit lab_event_path(@lab, event)

    within '.organizations-block' do
      page.should have_content("Aucune organisation.")

      # Select first organization
      find('.Select-placeholder', :wait => 3).click
      find('.Select-menu-outer', :wait => 3).click

      page.should have_content(organization.name)
    end

    event.reload

    event.organizations.should == [organization]
  end

  it 'can add an project to events' do
    project = FactoryBot.create(:project, :lab => @lab)

    Project.__elasticsearch__.refresh_index!

    event = @lab.events.first

    visit lab_event_path(@lab, event)

    within '.projects-block' do
      page.should have_content("Aucun projet.")

      # Select first project
      find('.Select-placeholder', :wait => 3).click
      find('.Select-menu-outer', :wait => 3).click

      page.should have_content(project.name)
    end

    sleep 1.0

    event.reload

    event.projects.should == [project]
  end

  it 'can navigate through events (next/previous)' do
    # MySQL sort is not the same as ruby sort on accents
    Event.all.to_a.each do |event|
      event.update(
        :name => I18n.transliterate(event.name),
      )
    end

    Event.__elasticsearch__.refresh_index!

    event_db_names = @lab.events.sort_by(&:sort_name).collect(&:name)

    visit lab_events_path(@lab)

    Capybara.current_session.current_window.resize_to(1280, 800)

    all('.event .name a').first.click

    find('.previous-next span').text.should == "1\n3"

    find('.previous-next .fa-caret-down').click

    find('.previous-next span').text.should == "2\n3"

    page.should have_content(event_db_names[1])

    find('.previous-next .fa-caret-down').click

    find('.previous-next span').text.should == "3\n3"

    page.should have_content(event_db_names[2])

    find('.previous-next .fa-caret-down').click

    find('.previous-next span').text.should == "1\n3"

    page.should have_content(event_db_names[0])

    find('.previous-next .fa-caret-up').click

    find('.previous-next span').text.should == "3\n3"

    page.should have_content(event_db_names[2])
  end

  it 'can create an event' do
    visit lab_events_path(@lab)

    click_on 'Nouvel évènement'

    sleep 0.4

    fill_in 'name', :with => 'Boostcamp'
    click_on 'Créer'

    sleep 0.4

    within '.item-show h1', :wait => 10 do
      page.should have_content("Boostcamp")
    end

    page.current_path.should == "/#{@lab.slug}/events/#{Event.pluck(:id).max}"

    page.should have_content("Retour à la liste")

    Event.order('id ASC').last.attributes.should include({
      'name' => 'Boostcamp',
    })
  end

  it 'can delete an event' do
    event = @lab.events.first

    visit lab_event_path(@lab, event)

    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      find('.dropdown-toggle').click

      click_on 'Supprimer'

      alert = page.driver.browser.switch_to.alert
      alert.text.should == "Supprimer cet évènement ?"
      alert.accept

      sleep 0.2 # for firefox!
    end

    page.current_path.should == "/#{@lab.slug}/events"

    page.should_not have_content(event.name)

    Event.where(:id => event.id).should == []
  end

  it "can't create/edit/delete any information if user has no permissions" do
    LabUserLink.first.update(
      :can_write_events => false
    )

    event = @lab.events.first

    visit lab_events_path(@lab)

    # Can't create
    page.should_not have_content('Nouvel')

    visit lab_event_path(@lab, event)

    # Can edit or delete
    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      page.should_not have_content('Modifier')
    end
  end

  it "can't read any information is user has no permissions" do
    LabUserLink.first.update(
      :can_write_events => false,
      :can_read_events  => false
    )

    event = @lab.events.first

    visit lab_events_path(@lab)

    page.should have_content("Vous n'avez pas accès à cette page.")
  end

  it 'propagates changes of an event into the list of events' do
    event = @lab.events.first
    Event.where(:id => Event.pluck(:id) - [event.id]).each { |p| p.destroy! } # keep only 1 event
    contact = FactoryBot.create(:contact, :lab => @lab)

    Contact.__elasticsearch__.refresh_index!
    Event.__elasticsearch__.refresh_index!

    visit lab_event_path(@lab, event)

    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      click_on 'Modifier', :wait => 3

      fill_in "Nom de l'évènement", :with => 'Boostcamp'
      fill_in "place", :with => 'Mons'
      fill_in "website", :with => 'https://boostcamp.be'
      fill_in "description", :with => 'Un nouveau départ pour votre projet'

      find('.dates .date-field a').click

      find('h1').click # close date selector

      click_on 'Enregistrer'
    end

    # Add tag
    within '.item-show .general' do
      find('.new-tag', :wait => 3).click
      fill_in 'Créer un nouveau tag', :with => "test tag\n"
      find('.new-tag', :wait => 3).click # close
    end

    # Add contact
    within '.contacts-block' do
      # Select first contact
      find('.Select-placeholder', :wait => 3).click
      find('.Select-menu-outer', :wait => 3).click

      sleep 1.0
    end

    click_on 'Retour à la liste'

    page.current_path.should == "/#{@lab.slug}/events"

    # Correct name
    page.should have_content('Boostcamp')

    # Correct contact
    page.should have_content("1 contact")

    # Correct tag
    page.should have_content('test tag')
  end
end
