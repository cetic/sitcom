describe 'Basic contacts', :js => true do

  before :each do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    LabUserLink.first.update(
      :can_write_contacts => true
    )

    3.times do
      FactoryBot.create(:contact, :lab => @lab)
    end

    @field = FactoryBot.create(:field, :lab => @lab)

    Contact.__elasticsearch__.refresh_index!

    login_as @user
  end

  it 'displays contacts sorted in listing' do
    visit lab_path(@lab)

    page_names = all('.contact .name').collect { |span| span.text }
    db_names   = @lab.contacts.sort_by(&:last_name).collect(&:name)

    page_names.should == db_names
  end

  it 'can access a specific contact page (by clicking on the list) and go back to list' do
    visit lab_path(@lab)

    first_contact = @lab.contacts.first

    click_link first_contact.name

    page.current_path.should == "/#{@lab.slug}/contacts/#{first_contact.id}"

    within '.item-show h1' do
      page.should have_content(first_contact.name)
    end

    page.should have_content("Retour à la liste")

    click_on 'Retour à la liste'

    page.current_path.should == "/#{@lab.slug}/contacts"
  end

  it 'can access a specific contact page (directly)' do
    contact = @lab.contacts.to_a[1]

    visit lab_contact_path(@lab, contact)

    page.current_path.should == "/#{@lab.slug}/contacts/#{contact.id}"

    within '.item-show h1' do
      page.should have_content(contact.name)
    end

    page.should have_content("Retour à la liste")

    click_on 'Retour à la liste'

    page.current_path.should == "/#{@lab.slug}/contacts"
  end

  it 'can edit a contact basic informations' do
    contact = @lab.contacts.first

    visit lab_contact_path(@lab, contact)

    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      click_on 'Modifier', :wait => 3

      fill_in 'Prénom', :with => 'Steve'
      fill_in 'Nom',    :with => 'Jobs'

      fill_in 'Rue',         :with => 'Rue de la loutre'
      fill_in 'Code postal', :with => '6000'
      fill_in 'Ville',       :with => 'Charleroi'
      fill_in 'Pays',        :with => 'Belgique'

      fill_in 'phone', :with => '0499665544'
      fill_in 'email', :with => 'contact@loutre.com'

      click_on 'Enregistrer'
    end

    within '.item-show h1', :wait => 3 do
      page.should have_content('Steve Jobs', :wait => 3)
    end

    contact.reload

    contact.name.should    == 'Steve Jobs'
    contact.address.should == "Rue de la loutre\n6000\nCharleroi\nBelgique"
    contact.phone.should   == '0499665544'
    contact.email.should   == 'contact@loutre.com'
  end

  it 'can add an expertise to a contact' do
    contact = @lab.contacts.first

    visit lab_contact_path(@lab, contact)

    within '.item-show', :wait => 3 do
      find('h1').hover # to make button appear

      click_on 'Modifier', :wait => 3
    end

    # Select first field
    within '.item-show .general' do
      find('.Select-placeholder', :wait => 3).click
      find('.Select-menu-outer', :wait => 3).click

      click_on 'Enregistrer', :wait => 4
    end

    sleep 2.0

    within '.item-show .fields', :wait => 3 do
      page.should have_content(@field.name, :wait => 3)
    end

    contact.reload

    contact.fields.should == [@field]
  end

  it 'can add a tag to a contact' do
    contact = @lab.contacts.first

    visit lab_contact_path(@lab, contact)

    within '.item-show .general' do
      find('.new-tag', :wait => 3).click
      fill_in 'Créer un nouveau tag', :with => "test tag\n"
      find('.new-tag', :wait => 3).click # close

      within '.tags' do
        page.should have_content('test tag')
      end
    end

    contact.reload

    contact.tags.first.name.should == 'test tag'
  end

  it 'can remove a tag from a contact' do
    contact = @lab.contacts.first

    contact.tags << Tag.create(:lab => @lab, :name => 'small test', :color => '#cccccc')

    contact.tags.first.name.should == 'small test'

    visit lab_contact_path(@lab, contact)

    within '.tags' do
      page.should have_content('small test')
    end

    # Select first field
    within '.item-show .general' do
      find('.new-tag', :wait => 3).click
      find('.tag-item .fa-remove', :wait => 3).click
      find('.new-tag', :wait => 3).click # close

      within '.tags' do
        page.should_not have_content('small test')
      end
    end

    contact.reload

    contact.tags.size.should == 0
  end

  it 'can add social links to a contact' do
    contact = @lab.contacts.first

    visit lab_contact_path(@lab, contact)

    within '.social' do
      find('.facebook').hover # to make button appear

      click_on 'Modifier', :wait => 3

      fill_in 'facebook', :with => 'https://facebook.com/user/mic'
      fill_in 'linkedin', :with => 'https://linkedin.com/user/mic'
      fill_in 'twitter',  :with => 'https://twitter.com/user/mic'

      click_on 'Enregistrer'
    end

    within '.social.show' do
      page.should have_content('https://facebook.com/user/mic')
      page.should have_content('https://linkedin.com/user/mic')
      page.should have_content('https://twitter.com/user/mic')
    end

    contact.reload

    contact.facebook_url.should == 'https://facebook.com/user/mic'
    contact.linkedin_url.should == 'https://linkedin.com/user/mic'
    contact.twitter_url.should  == 'https://twitter.com/user/mic'
  end

  it 'can add public and private notes' do
    contact = @lab.contacts.first

    visit lab_contact_path(@lab, contact)

    within '.notes-block' do
      find('.col-md-12:first-child .new-note a', :wait => 10).click

      fill_in 'Titre de la note', :with => 'Une note publique', :wait => 5
      fill_in 'Contenu', :with => "Contenu d'une note publique", :wait => 5

      find('.actions .btn-primary', :wait => 5).click # Ajouter

      find('.col-md-12:last-child .new-note a', :wait => 10).click

      fill_in 'Titre de la note', :with => 'Une note privée', :wait => 5
      fill_in 'Contenu', :with => "Contenu d'une note privée", :wait => 5

      find('.actions .btn-primary', :wait => 5).click # Ajouter

      sleep 5.0 # time to get websocket

      page.should have_content('Notes publiques (1)', :wait => 10)
      page.should have_content('Notes privées (1)',   :wait => 10)

      page.should have_content('Une note publique')
      page.should have_content("Contenu d'une note publique")

      page.should have_content('Une note privée')
      page.should have_content("Contenu d'une note privée")
    end

    contact.reload

    public_note = contact.notes.with_privacy(:public).first

    public_note.name.should == 'Une note publique'
    public_note.text.should == "Contenu d'une note publique"

    private_note = contact.notes.with_privacy(:private).first

    private_note.name.should == 'Une note privée'
    private_note.text.should == "Contenu d'une note privée"
  end

  it 'can edit different custom fields' do
    blood_field   = @lab.custom_fields.create!(:name => "Groupe sanguin", :field_type => :text)
    donator_field = @lab.custom_fields.create!(:name => "Donateur", :field_type => :bool)
    sex_field     = @lab.custom_fields.create!({
      :name       => "Sexe",
      :field_type => :enum,
      :options    => ['Homme', 'Femme']
    })

    contact = @lab.contacts.first

    visit lab_contact_path(@lab, contact)

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
      find('.Select-menu-outer', :wait => 3).click # Select "Femme"
      find('.col-md-6:nth-child(3) button', :wait => 3).click

      page.should have_content('A Négatif')
      page.should have_content('Oui')
      page.should have_content('Femme')
    end

    contact.reload

    contact.custom_field_links.where(:custom_field => blood_field).first.text_value.should   == 'A Négatif'
    contact.custom_field_links.where(:custom_field => donator_field).first.bool_value.should == true
    contact.custom_field_links.where(:custom_field => sex_field).first.text_value.should     == 'Femme'
  end

  xit 'can add an organization to contacts' do
  end

  xit 'can add a project to contacts' do
  end

  xit 'can add an event to contacts' do
  end

  xit "can't edit/delete any information if user has no permissions" do
    contact = @lab.contacts.first

    visit lab_contact_path(@lab, contact)

    find('.item-show h1').hover # to make button appear
  end

  xit 'can create a contact' do
  end

  xit 'can navigate through contacts (next/previous)' do
  end

  xit 'can delete a contact' do
  end

  xit 'propagates changes of a contact into the list of contacts' do
  end
end
