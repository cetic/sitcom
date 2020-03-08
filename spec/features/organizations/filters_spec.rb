describe 'Filters organizations', :js => true do

  before :each do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    LabUserLink.first.update(
      :can_read_organizations => true
    )

    login_as @user
  end

  it 'Filters by name in the quick search' do
    FactoryBot.create(:organization, {
      :lab  => @lab,
      :name => '80LIMIT',
    })

    FactoryBot.create(:organization, {
      :lab  => @lab,
      :name => 'Phonoid',
    })

    FactoryBot.create(:organization, {
      :lab  => @lab,
      :name => 'Cetic',
    })

    Organization.__elasticsearch__.refresh_index!

    visit lab_organizations_path(@lab)

    all('.organization .name').collect { |span| span.text }
                              .should == ['80LIMIT', 'Cetic', 'Phonoid']

    fill_in 'Recherche rapide', :with => '80'

    sleep 0.3 # wait for page refresh

    all('.organization .name').collect { |span| span.text }
                              .should == ['80LIMIT']
  end

  it 'Filters by website in general search' do
    FactoryBot.create(:organization, {
      :lab         => @lab,
      :name        => '80LIMIT',
      :website_url => 'https://80limit.com'
    })

    FactoryBot.create(:organization, {
      :lab         => @lab,
      :name        => 'Phonoid',
      :website_url => 'https://phonoid.com'
    })

    Organization.__elasticsearch__.refresh_index!

    visit lab_organizations_path(@lab)

    all('.organization .name').collect { |span| span.text }
                              .should == ['80LIMIT', 'Phonoid']

    fill_in 'organization_websiteUrl', :with => 'limit'

    sleep 0.3 # wait for page refresh

    all('.organization .name').collect { |span| span.text }
                              .should == ['80LIMIT']
  end

  it 'Filters by tag in associations search' do
    limit = FactoryBot.create(:organization, {
      :lab  => @lab,
      :name => '80LIMIT',
    })

    phonoid = FactoryBot.create(:organization, {
      :lab  => @lab,
      :name => 'Phonoid',
    })

    ItemTagService.new(User.first, phonoid).add_tag('audio')

    Organization.__elasticsearch__.refresh_index!

    visit lab_organizations_path(@lab)

    within('.col-tag') do
      find('.Select--multi').click
      find('.Select-option:first-child').click
    end

    sleep 2.0 # wait for page refresh

    all('.organization .name').collect { |span| span.text }
                              .should == ['Phonoid']
  end

  it 'Filters by contact in associations search' do
    limit = FactoryBot.create(:organization, {
      :lab  => @lab,
      :name => '80LIMIT',
    })

    phonoid = FactoryBot.create(:organization, {
      :lab  => @lab,
      :name => 'Phonoid',
    })

    contact = FactoryBot.create(:contact, :lab => @lab)

    limit.contacts = [contact]
    limit.save!

    Organization.__elasticsearch__.refresh_index!

    visit lab_organizations_path(@lab)

    within('.col-contact') do
      find('.Select--multi').click
      find('.Select-option:first-child').click
    end

    sleep 2.0 # wait for page refresh

    all('.organization .name').collect { |span| span.text }
                              .should == ['80LIMIT']
  end

  it 'Filters by custom field in personalized search' do
    limit = FactoryBot.create(:organization, {
      :lab  => @lab,
      :name => '80LIMIT',
    })

    phonoid = FactoryBot.create(:organization, {
      :lab  => @lab,
      :name => 'Phonoid',
    })

    donator_field = @lab.custom_fields.create!(
      :name       => "Donateur",
      :field_type => :bool,
      :item_type  => 'organization'
    )

    CustomFieldLink.create!(
      :custom_field_id => donator_field.id,
      :item_type       => 'Organization',
      :item_id         => limit.id,
      :bool_value      => false
    )

    CustomFieldLink.create!(
      :custom_field_id => donator_field.id,
      :item_type       => 'Organization',
      :item_id         => phonoid.id,
      :bool_value      => true
    )

    ReindexOrganizationWorker.perform_async(limit.id)
    ReindexOrganizationWorker.perform_async(phonoid.id)

    Organization.__elasticsearch__.refresh_index!

    visit lab_organizations_path(@lab)

    within('.custom-field-filter') do
      all('input')[1].click # donateur oui
    end

    sleep 2.0 # wait for page refresh

    all('.organization .name').collect { |span| span.text }
                              .should == ['Phonoid']

    within('.custom-field-filter') do
      all('input')[2].click # donateur non
    end

    sleep 2.0 # wait for page refresh

    all('.organization .name').collect { |span| span.text }
                              .should == ['80LIMIT']
  end
end
