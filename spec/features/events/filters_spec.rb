describe 'Filters events', :js => true, :focus => true do

  before :each do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    LabUserLink.first.update(
      :can_read_events => true
    )

    login_as @user
  end

  it 'Filters by name in the quick search' do
    FactoryBot.create(:event, {
      :lab  => @lab,
      :name => 'Boostcamp',
    })

    FactoryBot.create(:event, {
      :lab  => @lab,
      :name => 'Réunion annuelle',
    })

    FactoryBot.create(:event, {
      :lab  => @lab,
      :name => 'Repas annuel',
    })

    Event.__elasticsearch__.refresh_index!

    visit lab_events_path(@lab)

    all('.event .name').collect { |span| span.text }.sort
                       .should == ['Boostcamp', 'Réunion annuelle', 'Repas annuel'].sort

    fill_in 'Recherche rapide', :with => 'Annuel'

    sleep 0.3 # wait for page refresh

    all('.event .name').collect { |span| span.text }.sort
                       .should == ['Réunion annuelle', 'Repas annuel'].sort

    fill_in 'Recherche rapide', :with => 'Boost'

    sleep 0.3 # wait for page refresh

    all('.event .name').collect { |span| span.text }
                       .should == ['Boostcamp']
  end

  it 'Filters by place in general search' do
    FactoryBot.create(:event, {
      :lab   => @lab,
      :name  => 'Boostcamp',
      :place => 'Mons'
    })

    FactoryBot.create(:event, {
      :lab   => @lab,
      :name  => 'Réunion annuelle',
      :place => 'Bruxelles'
    })

    Event.__elasticsearch__.refresh_index!

    visit lab_events_path(@lab)

    all('.event .name').collect { |span| span.text }.sort
                       .should == ['Boostcamp', 'Réunion annuelle'].sort

    fill_in 'event_place', :with => 'Mons'

    sleep 0.3 # wait for page refresh

    all('.event .name').collect { |span| span.text }
                       .should == ['Boostcamp']
  end

  it 'Filters by tag in associations search' do
    boostcamp = FactoryBot.create(:event, {
      :lab   => @lab,
      :name  => 'Boostcamp'
    })

    meeting = FactoryBot.create(:event, {
      :lab   => @lab,
      :name  => 'Réunion annuelle'
    })

    ItemTagService.new(User.first, boostcamp).add_tag('test')

    Event.__elasticsearch__.refresh_index!

    visit lab_events_path(@lab)

    within('.col-tag') do
      find('.Select--multi').click
      find('.Select-option:first-child').click
    end

    sleep 2.0 # wait for page refresh

    all('.event .name').collect { |span| span.text }
                       .should == ['Boostcamp']
  end

  it 'Filters by contact in associations search' do
    boostcamp = FactoryBot.create(:event, {
      :lab   => @lab,
      :name  => 'Boostcamp'
    })

    meeting = FactoryBot.create(:event, {
      :lab   => @lab,
      :name  => 'Réunion annuelle'
    })

    contact = FactoryBot.create(:contact, :lab => @lab)

    boostcamp.contacts = [contact]
    boostcamp.save!

    Event.__elasticsearch__.refresh_index!

    visit lab_events_path(@lab)

    within('.col-contact') do
      find('.Select--multi').click
      find('.Select-option:first-child').click
    end

    sleep 2.0 # wait for page refresh

    all('.event .name').collect { |span| span.text }
                       .should == ['Boostcamp']
  end

  it 'Filters by custom field in personalized search' do
    boostcamp = FactoryBot.create(:event, {
      :lab   => @lab,
      :name  => 'Boostcamp'
    })

    meeting = FactoryBot.create(:event, {
      :lab   => @lab,
      :name  => 'Réunion annuelle'
    })

    donator_field = @lab.custom_fields.create!(
      :name       => "Donateur",
      :field_type => :bool,
      :item_type  => 'event'
    )

    CustomFieldLink.create!(
      :custom_field_id => donator_field.id,
      :item_type       => 'Event',
      :item_id         => boostcamp.id,
      :bool_value      => false
    )

    CustomFieldLink.create!(
      :custom_field_id => donator_field.id,
      :item_type       => 'Event',
      :item_id         => meeting.id,
      :bool_value      => true
    )

    ReindexEventWorker.perform_async(boostcamp.id)
    ReindexEventWorker.perform_async(meeting.id)

    Event.__elasticsearch__.refresh_index!

    visit lab_events_path(@lab)

    within('.custom-field-filter') do
      all('input')[1].click # donateur oui
    end

    sleep 2.0 # wait for page refresh

    all('.event .name').collect { |span| span.text }
                       .should == ['Réunion annuelle']

    within('.custom-field-filter') do
      all('input')[2].click # donateur non
    end

    sleep 2.0 # wait for page refresh

    all('.event .name').collect { |span| span.text }
                       .should == ['Boostcamp']
  end
end
