describe 'Basic organizations', :js => true do

  before :each do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    LabUserLink.first.update(
      :can_write_organizations => true
    )

    3.times do
      FactoryBot.create(:organization, :lab => @lab)
    end

    Organization.__elasticsearch__.refresh_index!

    login_as @user
  end

  it 'displays organizations sorted in listing' do
    # MySQL sort is not the same as ruby sort on accents
    Organization.all.to_a.each do |organization|
      organization.update(
        :name => I18n.transliterate(organization.name),
      )
    end

    Organization.__elasticsearch__.refresh_index!

    visit lab_organizations_path(@lab)

    page_names = all('.organization .name').collect { |span| span.text }
    db_names   = @lab.organizations.sort_by(&:name).collect(&:name)

    page_names.should == db_names
  end

  it 'can access a specific organization page (by clicking on the list) and go back to list' do
    visit lab_organizations_path(@lab)

    first_organization = @lab.organizations.first

    click_link first_organization.name

    page.current_path.should == "/#{@lab.slug}/organizations/#{first_organization.id}"

    within '.item-show h1' do
      page.should have_content(first_organization.name)
    end

    page.should have_content("Retour à la liste")

    click_on 'Retour à la liste'

    page.current_path.should == "/#{@lab.slug}/organizations"
  end

  it 'can access a specific organization page (directly)' do
    organization = @lab.organizations.to_a[1]

    visit lab_organization_path(@lab, organization)

    page.current_path.should == "/#{@lab.slug}/organizations/#{organization.id}"

    within '.item-show h1' do
      page.should have_content(organization.name)
    end

    page.should have_content("Retour à la liste")

    click_on 'Retour à la liste'

    page.current_path.should == "/#{@lab.slug}/organizations"
  end

  it 'can edit a organization basic informations' do
    organization = @lab.organizations.first

    visit lab_organization_path(@lab, organization)

    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      click_on 'Modifier', :wait => 3

      fill_in "Nom de l'organisation", :with => '80LIMIT'

      fill_in "Statut",      :with => 'SRL'
      fill_in "website" ,    :with => 'https://80limit.com'
      fill_in "description", :with => 'Nous transformons vos idées en applications web et mobile'

      click_on 'Enregistrer'
    end

    within '.item-show h1', :wait => 10 do
      page.should have_content('80LIMIT', :wait => 3)
    end

    organization.reload

    organization.name.should        == '80LIMIT'
    organization.status.should      == 'SRL'
    organization.website_url.should == 'https://80limit.com'
    organization.description.should == 'Nous transformons vos idées en applications web et mobile'
  end

  it 'can add a tag to a organization' do
    organization = @lab.organizations.first

    visit lab_organization_path(@lab, organization)

    within '.item-show .general' do
      find('.new-tag', :wait => 3).click
      fill_in 'Créer un nouveau tag', :with => "test tag\n"
      find('.new-tag', :wait => 3).click # close

      within '.tags' do
        page.should have_content('test tag')
      end
    end

    organization.reload

    organization.tags.first.name.should == 'test tag'
  end

  it 'can remove a tag from a organization' do
    organization = @lab.organizations.first

    organization_tag = Tag.create(:lab => @lab, :name => 'small test', :color => '#cccccc', :item_type => 'Organization')
    organization.tags << organization_tag

    organization.tags.first.name.should == 'small test'

    visit lab_organization_path(@lab, organization)

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

    organization.reload

    organization.tags.size.should == 0
  end

  it 'can add public and private notes' do
    organization = @lab.organizations.first

    visit lab_organization_path(@lab, organization)

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

    organization.reload

    public_note = organization.notes.with_privacy(:public).first

    public_note.name.should == 'Une note publique'
    public_note.text.should == "Contenu d'une note publique"

    private_note = organization.notes.with_privacy(:private).first

    private_note.name.should == 'Une note privée'
    private_note.text.should == "Contenu d'une note privée"
  end

  it 'can edit different custom fields' do
    blood_field   = @lab.custom_fields.create!(:name => "Groupe sanguin", :field_type => :text, :item_type => 'Organization')
    donator_field = @lab.custom_fields.create!(:name => "Donateur", :field_type => :bool, :item_type => 'Organization')
    sex_field     = @lab.custom_fields.create!({
      :name       => "Sexe",
      :field_type => :enum,
      :options    => ['Homme', 'Femme'],
      :item_type  => 'Organization'
    })

    organization = @lab.organizations.first

    visit lab_organization_path(@lab, organization)

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

    organization.reload

    organization.custom_field_links.where(:custom_field => blood_field).first.text_value.should   == 'A Négatif'
    organization.custom_field_links.where(:custom_field => donator_field).first.bool_value.should == true
    organization.custom_field_links.where(:custom_field => sex_field).first.text_value.should     == 'Femme'
  end

  it 'can add a contact to organizations and the contact role' do
    contact = FactoryBot.create(:contact, :lab => @lab)

    Contact.__elasticsearch__.refresh_index!

    organization = @lab.organizations.first

    visit lab_organization_path(@lab, organization)

    within '.contacts-block' do
      page.should have_content("Aucun contact.")

      # Select first contact
      find('.Select-placeholder', :wait => 3).click
      sleep 0.3
      find('.Select-menu-outer', :wait => 3).click

      page.should have_content(contact.name)

      find('h4').hover

      click_on 'Modifier le rôle', :wait => 5
      fill_in 'role', :with => "Prestataire\n"

      sleep 1.0
    end

    organization.reload

    organization.contacts.should == [contact]
    organization.contact_organization_links.first.role.should == 'Prestataire'
  end

  it 'can add a project to organizations' do
    project = FactoryBot.create(:project, :lab => @lab)

    Project.__elasticsearch__.refresh_index!

    organization = @lab.organizations.first

    visit lab_organization_path(@lab, organization)

    within '.projects-block' do
      page.should have_content("Aucun projet.")

      # Select first project
      find('.Select-placeholder', :wait => 3).click
      sleep 0.3
      find('.Select-menu-outer', :wait => 3).click

      page.should have_content(project.name)
    end

    organization.reload

    organization.projects.should == [project]
  end

  it 'can add an event to organizations' do
    event = FactoryBot.create(:event, :lab => @lab)

    Event.__elasticsearch__.refresh_index!

    organization = @lab.organizations.first

    visit lab_organization_path(@lab, organization)

    within '.events-block' do
      page.should have_content("Aucun évènement.")

      # Select first event
      find('.Select-placeholder', :wait => 3).click
      sleep 0.3
      find('.Select-menu-outer', :wait => 3).click

      page.should have_content(event.name)
    end

    organization.reload

    organization.events.should == [event]
  end

  it 'can navigate through organizations (next/previous)' do
    # MySQL sort is not the same as ruby sort on accents
    Organization.all.to_a.each do |organization|
      organization.update(
        :name => I18n.transliterate(organization.name),
      )
    end

    Organization.__elasticsearch__.refresh_index!

    organization_db_names = @lab.organizations.sort_by(&:name).collect(&:name)

    visit lab_organizations_path(@lab)

    Capybara.current_session.current_window.resize_to(1280, 800)

    all('.organization .name a').first.click

    find('.previous-next span').text.should == "1\n3"

    find('.previous-next .fa-caret-down').click

    find('.previous-next span').text.should == "2\n3"

    page.should have_content(organization_db_names[1])

    find('.previous-next .fa-caret-down').click

    find('.previous-next span').text.should == "3\n3"

    page.should have_content(organization_db_names[2])

    find('.previous-next .fa-caret-down').click

    find('.previous-next span').text.should == "1\n3"

    page.should have_content(organization_db_names[0])

    find('.previous-next .fa-caret-up').click

    find('.previous-next span').text.should == "3\n3"

    page.should have_content(organization_db_names[2])
  end

  it 'can create an organization' do
    visit lab_organizations_path(@lab)

    click_on 'Nouvelle organisation'

    sleep 0.4

    fill_in 'name', :with => '80LIMIT'
    click_on 'Créer'

    sleep 0.4

    within '.item-show h1', :wait => 10 do
      page.should have_content("80LIMIT")
    end

    page.current_path.should == "/#{@lab.slug}/organizations/#{Organization.pluck(:id).max}"

    page.should have_content("Retour à la liste")

    Organization.order('id ASC').last.attributes.should include({
      'name' => '80LIMIT',
    })
  end

  it 'can delete an organization' do
    organization = @lab.organizations.first

    visit lab_organization_path(@lab, organization)

    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      find('.dropdown-toggle').click

      click_on 'Supprimer'

      alert = page.driver.browser.switch_to.alert
      alert.text.should == "Supprimer cette organisation ?"
      alert.accept

      sleep 0.2 # for firefox!
    end

    page.current_path.should == "/#{@lab.slug}/organizations"

    page.should_not have_content(organization.name)

    Organization.where(:id => organization.id).should == []
  end

  it "can't create/edit/delete any information if user has no permissions" do
    LabUserLink.first.update(
      :can_write_organizations => false
    )

    organization = @lab.organizations.first

    visit lab_organizations_path(@lab)

    # Can't create
    page.should_not have_content('Nouvelle')

    visit lab_organization_path(@lab, organization)

    # Can edit or delete
    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      page.should_not have_content('Modifier')
    end
  end

  it "can't read any information is user has no permissions" do
    LabUserLink.first.update(
      :can_write_organizations => false,
      :can_read_organizations  => false
    )

    organization = @lab.organizations.first

    visit lab_organizations_path(@lab)

    page.should have_content("Vous n'avez pas accès à cette page.")
  end

  it 'propagates changes of an organization into the list of organizations' do
    organization      = @lab.organizations.first
    Organization.where(:id => Organization.pluck(:id) - [organization.id]).each { |o| o.destroy! } # keep only 1 organization
    contact = FactoryBot.create(:contact, :lab => @lab)

    Contact.__elasticsearch__.refresh_index!
    Organization.__elasticsearch__.refresh_index!

    visit lab_organization_path(@lab, organization)

    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      click_on 'Modifier', :wait => 3

      fill_in "Nom de l'organisation", :with => '80LIMIT'

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
      sleep 0.3
      find('.Select-menu-outer', :wait => 3).click

      sleep 1.0
    end

    click_on 'Retour à la liste'

    page.current_path.should == "/#{@lab.slug}/organizations"

    # Correct name
    page.should have_content('80LIMIT')

    # Correct contact
    page.should have_content(Contact.first.name)

    # Correct tag
    page.should have_content('test tag')
  end
end
