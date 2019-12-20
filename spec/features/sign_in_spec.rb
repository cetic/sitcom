describe 'Sign in' do
  before :each do
    @lab = FactoryBot.create(:lab, {
      :name => 'Living Lab 1'
    })

    @user = FactoryBot.create(:user, {
      :labs                  => [@lab],
      :password              => 'dumbpassword',
      :password_confirmation => 'dumbpassword',
      :name                  => 'John'
    })
  end

  it 'works and allows the user to select a lab (only the first time!)' do
    visit '/'

    within '.container form#new_user' do
      fill_in 'Email',        :with => @user.email
      fill_in 'Mot de passe', :with => 'dumbpassword'

      click_button 'Se connecter'
    end

    # Page for selection of lab
    current_url.should == 'http://www.example.com/'

    expect(page).to have_content('Labs')
    expect(page).to have_content(@lab.name)

    click_link @lab.name

    # "Living Lab 1" lab page (list of contacts)
    current_url.should == 'http://www.example.com/living-lab-1/contacts'

    expect(page).to have_content('Living Lab 1')
    expect(page).to have_content('John')

    # Still lab page (selected lab in cookies)
    visit '/'

    current_url.should == 'http://www.example.com/living-lab-1/contacts'

    expect(page).to have_content('Living Lab 1')
    expect(page).to have_content('John')
  end
end
