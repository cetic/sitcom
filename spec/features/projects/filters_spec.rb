describe 'Filters projects', :js => true do

  before :each do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    LabUserLink.first.update(
      :can_read_projects => true
    )

    login_as @user
  end

  it 'Filters by name in the quick search' do
    FactoryBot.create(:project, {
      :lab  => @lab,
      :name => 'Creative Valley',
    })

    FactoryBot.create(:project, {
      :lab  => @lab,
      :name => 'Living Labs',
    })

    FactoryBot.create(:project, {
      :lab  => @lab,
      :name => 'Creative Wallonia',
    })

    Project.__elasticsearch__.refresh_index!

    visit lab_projects_path(@lab)

    all('.project .name').collect { |span| span.text }.sort
                         .should == ['Creative Valley', 'Creative Wallonia', 'Living Labs'].sort

    fill_in 'Recherche rapide', :with => 'Labs'

    sleep 0.3 # wait for page refresh

    all('.project .name').collect { |span| span.text }
                         .should == ['Living Labs']

    fill_in 'Recherche rapide', :with => 'Creative'

    sleep 0.3 # wait for page refresh

    all('.project .name').collect { |span| span.text }.sort
                         .should == ['Creative Valley', 'Creative Wallonia'].sort
  end

  it 'Filters by description in general search' do
    FactoryBot.create(:project, {
      :lab         => @lab,
      :name        => 'Creative Valley',
      :description => 'Creative Valley est le hub créatif du Cœur du Hainaut.'
    })

    FactoryBot.create(:project, {
      :lab         => @lab,
      :name        => 'Living Labs',
      :description => 'Living Labs in Wallonia est une initiative de Creative Wallonia qui rassemble et soutient les Living Labs wallons.'
    })

    Project.__elasticsearch__.refresh_index!

    visit lab_projects_path(@lab)

    all('.project .name').collect { |span| span.text }.sort
                         .should == ['Creative Valley', 'Living Labs'].sort

    fill_in 'project_description', :with => 'hub créatif'

    sleep 0.3 # wait for page refresh

    all('.project .name').collect { |span| span.text }
                         .should == ['Creative Valley']
  end

  it 'Filters by tag in associations search' do
    creative = FactoryBot.create(:project, {
      :lab  => @lab,
      :name => 'Creative Valley',
    })

    living = FactoryBot.create(:project, {
      :lab  => @lab,
      :name => 'Living Labs',
    })

    ItemTagService.new(User.first, living).add_tag('test')

    Project.__elasticsearch__.refresh_index!

    visit lab_projects_path(@lab)

    within('.col-tag') do
      find('.Select--multi').click
      find('.Select-option:first-child').click
    end

    sleep 2.0 # wait for page refresh

    all('.project .name').collect { |span| span.text }
                         .should == ['Living Labs']
  end

  it 'Filters by contact in associations search' do
    creative = FactoryBot.create(:project, {
      :lab  => @lab,
      :name => 'Creative Valley',
    })

    living = FactoryBot.create(:project, {
      :lab  => @lab,
      :name => 'Living Labs',
    })

    contact = FactoryBot.create(:contact, :lab => @lab)

    living.contacts = [contact]
    living.save!

    Project.__elasticsearch__.refresh_index!

    visit lab_projects_path(@lab)

    within('.col-contact') do
      find('.Select--multi').click
      find('.Select-option:first-child').click
    end

    sleep 2.0 # wait for page refresh

    all('.project .name').collect { |span| span.text }
                         .should == ['Living Labs']
  end

  it 'Filters by custom field in personalized search' do
    creative = FactoryBot.create(:project, {
      :lab  => @lab,
      :name => 'Creative Valley',
    })

    living = FactoryBot.create(:project, {
      :lab  => @lab,
      :name => 'Living Labs',
    })

    donator_field = @lab.custom_fields.create!(
      :name       => "Donateur",
      :field_type => :bool,
      :item_type  => 'project'
    )

    CustomFieldLink.create!(
      :custom_field_id => donator_field.id,
      :item_type       => 'Project',
      :item_id         => creative.id,
      :bool_value      => false
    )

    CustomFieldLink.create!(
      :custom_field_id => donator_field.id,
      :item_type       => 'Project',
      :item_id         => living.id,
      :bool_value      => true
    )

    ReindexProjectWorker.perform_async(creative.id)
    ReindexProjectWorker.perform_async(living.id)

    Project.__elasticsearch__.refresh_index!

    visit lab_projects_path(@lab)

    within('.custom-field-filter') do
      all('input')[1].click # donateur oui
    end

    sleep 2.0 # wait for page refresh

    all('.project .name').collect { |span| span.text }
                         .should == ['Living Labs']

    within('.custom-field-filter') do
      all('input')[2].click # donateur non
    end

    sleep 2.0 # wait for page refresh

    all('.project .name').collect { |span| span.text }
                         .should == ['Creative Valley']
  end
end
