describe 'Basic projects', :js => true do

  before :each do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    LabUserLink.first.update(
      :can_write_projects => true
    )

    3.times do
      FactoryBot.create(:project, :lab => @lab)
    end

    Project.__elasticsearch__.refresh_index!

    login_as @user
  end

  it 'displays projects sorted in listing' do
    # MySQL sort is not the same as ruby sort on accents
    Project.all.to_a.each do |project|
      project.update(
        :name => I18n.transliterate(project.name),
      )
    end

    Project.__elasticsearch__.refresh_index!

    visit lab_projects_path(@lab)

    page_names = all('.project .name').collect { |span| span.text }
    db_names   = @lab.projects.sort_by(&:sort_name).collect(&:name)

    page_names.should == db_names
  end

  it 'can access a specific project page (by clicking on the list) and go back to list' do
    visit lab_projects_path(@lab)

    first_project = @lab.projects.first

    click_link first_project.name

    page.current_path.should == "/#{@lab.slug}/projects/#{first_project.id}"

    within '.item-show h1' do
      page.should have_content(first_project.name)
    end

    page.should have_content("Retour à la liste")

    click_on 'Retour à la liste'

    page.current_path.should == "/#{@lab.slug}/projects"
  end

  it 'can access a specific project page (directly)' do
    project = @lab.projects.to_a[1]

    visit lab_project_path(@lab, project)

    page.current_path.should == "/#{@lab.slug}/projects/#{project.id}"

    within '.item-show h1' do
      page.should have_content(project.name)
    end

    page.should have_content("Retour à la liste")

    click_on 'Retour à la liste'

    page.current_path.should == "/#{@lab.slug}/projects"
  end

  it 'can edit a project basic informations' do
    project = @lab.projects.first

    project.update!(:start_date => nil, :end_date => nil)

    visit lab_project_path(@lab, project)

    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      click_on 'Modifier', :wait => 3

      fill_in "Nom du projet", :with => 'Creative Valley'
      fill_in "description",   :with => 'Nous transformons vos idées en applications web et mobile'

      find('.start-date .date-field a').click
      find('.end-date .date-field a').click

      find('h1').click # close date selector

      click_on 'Enregistrer'
    end

    within '.item-show h1', :wait => 10 do
      page.should have_content('Creative Valley', :wait => 3)
    end

    project.reload

    project.name.should       == 'Creative Valley'
    project.start_date.should == Date.today
    project.end_date.should   == Date.today
  end

  it 'can add a tag to a project' do
    project = @lab.projects.first

    visit lab_project_path(@lab, project)

    within '.item-show .general' do
      find('.new-tag', :wait => 3).click
      fill_in 'Créer un nouveau tag', :with => "test tag\n"
      find('.new-tag', :wait => 3).click # close

      within '.tags' do
        page.should have_content('test tag')
      end
    end

    project.reload

    project.tags.first.name.should == 'test tag'
  end

  it 'can remove a tag from a project' do
    project = @lab.projects.first

    project_tag = Tag.create(:lab => @lab, :name => 'small test', :color => '#cccccc', :item_type => 'Project')
    project.tags << project_tag

    project.tags.first.name.should == 'small test'

    visit lab_project_path(@lab, project)

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

    project.reload

    project.tags.size.should == 0
  end

  it 'can add public and private notes' do
    project = @lab.projects.first

    visit lab_project_path(@lab, project)

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

    project.reload

    public_note = project.notes.with_privacy(:public).first

    public_note.name.should == 'Une note publique'
    public_note.text.should == "Contenu d'une note publique"

    private_note = project.notes.with_privacy(:private).first

    private_note.name.should == 'Une note privée'
    private_note.text.should == "Contenu d'une note privée"
  end

  it 'can edit different custom fields' do
    blood_field   = @lab.custom_fields.create!(:name => "Groupe sanguin", :field_type => :text, :item_type => 'Project')
    donator_field = @lab.custom_fields.create!(:name => "Donateur", :field_type => :bool, :item_type => 'Project')
    sex_field     = @lab.custom_fields.create!({
      :name       => "Sexe",
      :field_type => :enum,
      :options    => ['Homme', 'Femme'],
      :item_type  => 'Project'
    })

    project = @lab.projects.first

    visit lab_project_path(@lab, project)

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

    project.reload

    project.custom_field_links.where(:custom_field => blood_field).first.text_value.should   == 'A Négatif'
    project.custom_field_links.where(:custom_field => donator_field).first.bool_value.should == true
    project.custom_field_links.where(:custom_field => sex_field).first.text_value.should     == 'Femme'
  end

  it 'can add a contact to projects and the contact role' do
    contact = FactoryBot.create(:contact, :lab => @lab)

    Contact.__elasticsearch__.refresh_index!

    project = @lab.projects.first

    visit lab_project_path(@lab, project)

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

    project.reload

    project.contacts.should == [contact]
    project.contact_project_links.first.role.should == 'Prestataire'
  end

  it 'can add an organization to projects' do
    organization = FactoryBot.create(:organization, :lab => @lab)

    Organization.__elasticsearch__.refresh_index!

    project = @lab.projects.first

    visit lab_project_path(@lab, project)

    within '.organizations-block' do
      page.should have_content("Aucune organisation.")

      # Select first organization
      find('.Select-placeholder', :wait => 3).click
      find('.Select-menu-outer', :wait => 3).click

      page.should have_content(organization.name)
    end

    project.reload

    project.organizations.should == [organization]
  end

  it 'can add an event to projects' do
    event = FactoryBot.create(:event, :lab => @lab)

    Event.__elasticsearch__.refresh_index!

    project = @lab.projects.first

    visit lab_project_path(@lab, project)

    within '.events-block' do
      page.should have_content("Aucun évènement.")

      # Select first event
      find('.Select-placeholder', :wait => 3).click
      find('.Select-menu-outer', :wait => 3).click

      page.should have_content(event.name)
    end

    sleep 1.0

    project.reload

    project.events.should == [event]
  end

  it 'can navigate through projects (next/previous)' do
    # MySQL sort is not the same as ruby sort on accents
    Project.all.to_a.each do |project|
      project.update(
        :name => I18n.transliterate(project.name),
      )
    end

    Project.__elasticsearch__.refresh_index!

    project_db_names = @lab.projects.sort_by(&:sort_name).collect(&:name)

    visit lab_projects_path(@lab)

    Capybara.current_session.current_window.resize_to(1280, 800)

    all('.project .name a').first.click

    find('.previous-next span').text.should == "1\n3"

    find('.previous-next .fa-caret-down').click

    find('.previous-next span').text.should == "2\n3"

    page.should have_content(project_db_names[1])

    find('.previous-next .fa-caret-down').click

    find('.previous-next span').text.should == "3\n3"

    page.should have_content(project_db_names[2])

    find('.previous-next .fa-caret-down').click

    find('.previous-next span').text.should == "1\n3"

    page.should have_content(project_db_names[0])

    find('.previous-next .fa-caret-up').click

    find('.previous-next span').text.should == "3\n3"

    page.should have_content(project_db_names[2])
  end

  it 'can create a project' do
    visit lab_projects_path(@lab)

    click_on 'Nouveau projet'

    sleep 0.4

    fill_in 'name', :with => 'Creative Valley'
    click_on 'Créer'

    sleep 0.4

    within '.item-show h1', :wait => 10 do
      page.should have_content("Creative Valley")
    end

    page.current_path.should == "/#{@lab.slug}/projects/#{Project.pluck(:id).max}"

    page.should have_content("Retour à la liste")

    Project.order('id ASC').last.attributes.should include({
      'name' => 'Creative Valley',
    })
  end

  it 'can delete a project' do
    project = @lab.projects.first

    visit lab_project_path(@lab, project)

    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      find('.dropdown-toggle').click

      click_on 'Supprimer'

      alert = page.driver.browser.switch_to.alert
      alert.text.should == "Supprimer ce projet ?"
      alert.accept

      sleep 0.2 # for firefox!
    end

    page.current_path.should == "/#{@lab.slug}/projects"

    page.should_not have_content(project.name)

    Project.where(:id => project.id).should == []
  end

  it "can't create/edit/delete any information if user has no permissions" do
    LabUserLink.first.update(
      :can_write_projects => false
    )

    project = @lab.projects.first

    visit lab_projects_path(@lab)

    # Can't create
    page.should_not have_content('Nouveau')

    visit lab_project_path(@lab, project)

    # Can edit or delete
    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      page.should_not have_content('Modifier')
    end
  end

  it "can't read any information is user has no permissions" do
    LabUserLink.first.update(
      :can_write_projects => false,
      :can_read_projects  => false
    )

    project = @lab.projects.first

    visit lab_projects_path(@lab)

    page.should have_content("Vous n'avez pas accès à cette page.")
  end

  it 'propagates changes of a project into the list of projects' do
    project = @lab.projects.first
    Project.where(:id => Project.pluck(:id) - [project.id]).each { |p| p.destroy! } # keep only 1 project
    contact = FactoryBot.create(:contact, :lab => @lab)

    Contact.__elasticsearch__.refresh_index!
    Project.__elasticsearch__.refresh_index!

    visit lab_project_path(@lab, project)

    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      click_on 'Modifier', :wait => 3

      fill_in "Nom du projet", :with => 'Creative Valley'

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

    page.current_path.should == "/#{@lab.slug}/projects"

    # Correct name
    page.should have_content('Creative Valley')

    # Correct contact
    page.should have_content("1 contact")

    # Correct tag
    page.should have_content('test tag')
  end
end
