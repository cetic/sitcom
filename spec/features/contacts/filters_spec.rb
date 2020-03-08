describe 'Filters contacts', :js => true do

  before :each do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    LabUserLink.first.update(
      :can_read_contacts => true
    )

    login_as @user
  end

  it 'Filters by name in the quick search' do
    FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Steve',
      :last_name  => 'Jobs'
    })

    FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Elon',
      :last_name  => 'Musk'
    })

    FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Steve',
      :last_name  => 'Wozniak'
    })

    Contact.__elasticsearch__.refresh_index!

    visit lab_contacts_path(@lab)

    all('.contact .name').collect { |span| span.text }
                         .should == ['Steve Jobs', 'Elon Musk', 'Steve Wozniak']

    fill_in 'Recherche rapide', :with => 'Steve'

    sleep 0.3 # wait for page refresh

    all('.contact .name').collect { |span| span.text }
                         .should == ['Steve Jobs', 'Steve Wozniak']

    fill_in 'Recherche rapide', :with => 'Steve J'

    sleep 0.3 # wait for page refresh

    all('.contact .name').collect { |span| span.text }
                         .should == ['Steve Jobs']
  end

  it 'Filters by email in general search' do
    FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Steve',
      :last_name  => 'Jobs',
      :email      => 'steve.jobs@gmail.com'
    })

    FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Elon',
      :last_name  => 'Musk',
      :email      => 'elon.musk@gmail.com'
    })

    Contact.__elasticsearch__.refresh_index!

    visit lab_contacts_path(@lab)

    all('.contact .name').collect { |span| span.text }
                         .should == ['Steve Jobs', 'Elon Musk']

    fill_in 'contact_email', :with => 'elon'

    sleep 0.3 # wait for page refresh

    all('.contact .name').collect { |span| span.text }
                         .should == ['Elon Musk']
  end

  it 'Filters by activity in general search' do
    FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Steve',
      :last_name  => 'Jobs',
      :active     => false
    })

    FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Elon',
      :last_name  => 'Musk',
      :active     => true
    })

    Contact.__elasticsearch__.refresh_index!

    visit lab_contacts_path(@lab)

    find('#contacts_active_active').click

    sleep 0.3 # wait for page refresh

    all('.contact .name').collect { |span| span.text }
                         .should == ['Elon Musk']

    find('#contacts_active_inactive').click

    sleep 0.3 # wait for page refresh

    all('.contact .name').collect { |span| span.text }
                         .should == ['Steve Jobs']
  end

  it 'Filters by tag in associations search' do
    FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Steve',
      :last_name  => 'Jobs'
    })

    elon = FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Elon',
      :last_name  => 'Musk'
    })

    ItemTagService.new(User.first, elon).add_tag('hello')

    Contact.__elasticsearch__.refresh_index!

    visit lab_contacts_path(@lab)

    within('.col-tag') do
      find('.Select--multi').click
      find('.Select-option:first-child').click
    end

    sleep 2.0 # wait for page refresh

    all('.contact .name').collect { |span| span.text }
                         .should == ['Elon Musk']
  end

  it 'Filters by expertises in associations search' do
    FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Steve',
      :last_name  => 'Jobs'
    })

    elon = FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Elon',
      :last_name  => 'Musk'
    })

    field = FactoryBot.create(:field, :lab => @lab)

    elon.fields = [field]
    elon.save!

    Contact.__elasticsearch__.refresh_index!

    visit lab_contacts_path(@lab)

    within('.col-field', :wait => 10) do
      find('.Select--multi').click
      find('.Select-option:first-child').click
    end

    sleep 2.0 # wait for page refresh

    all('.contact .name', :wait => 20).collect { |span| span.text }
                                      .should == ['Elon Musk']
  end

  it 'Filters by organization in associations search' do
    FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Steve',
      :last_name  => 'Jobs'
    })

    elon = FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Elon',
      :last_name  => 'Musk'
    })

    organization = FactoryBot.create(:organization, :lab => @lab)

    elon.organizations = [organization]
    elon.save!

    Contact.__elasticsearch__.refresh_index!

    visit lab_contacts_path(@lab)

    within('.col-organization') do
      find('.Select--multi').click
      find('.Select-option:first-child').click
    end

    sleep 2.0 # wait for page refresh

    all('.contact .name').collect { |span| span.text }
                         .should == ['Elon Musk']
  end

  it 'Filters by custom field in personalized search' do
    steve = FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Steve',
      :last_name  => 'Jobs'
    })

    elon = FactoryBot.create(:contact, {
      :lab        => @lab,
      :first_name => 'Elon',
      :last_name  => 'Musk'
    })

    donator_field = @lab.custom_fields.create!(
      :name       => "Donateur",
      :field_type => :bool,
      :item_type  => 'contact'
    )

    CustomFieldLink.create!(
      :custom_field_id => donator_field.id,
      :item_type       => 'Contact',
      :item_id         => steve.id,
      :bool_value      => false
    )

    CustomFieldLink.create!(
      :custom_field_id => donator_field.id,
      :item_type       => 'Contact',
      :item_id         => elon.id,
      :bool_value      => true
    )

    ReindexContactWorker.perform_async(steve.id)
    ReindexContactWorker.perform_async(elon.id)

    Contact.__elasticsearch__.refresh_index!

    visit lab_contacts_path(@lab)

    within('.custom-field-filter') do
      all('input')[1].click # donateur oui
    end

    sleep 2.0 # wait for page refresh

    all('.contact .name').collect { |span| span.text }
                         .should == ['Elon Musk']

    within('.custom-field-filter') do
      all('input')[2].click # donateur non
    end

    sleep 2.0 # wait for page refresh

    all('.contact .name').collect { |span| span.text }
                         .should == ['Steve Jobs']
  end
end
