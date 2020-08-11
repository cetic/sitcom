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

  it 'works and allows the user to select a lab (only the first time!)', :js => true do
    sleep 0.3

    visit '/'

    sleep 0.3

    within '.intro-text' do
      click_on 'Accéder à SitCom'
    end

    within '.container form#new_user', :wait => 15 do
      fill_in 'Email',        :with => @user.email
      fill_in 'Mot de passe', :with => 'dumbpassword'

      click_button 'Se connecter'
    end

    # Page for selection of lab
    current_url.should end_with '/'

    expect(page).to have_content('Comptes')
    expect(page).to have_content(@lab.name)

    click_link @lab.name

    # "Living Lab 1" lab page (dashboard)
    current_url.should end_with '/living-lab-1/dashboard'

    expect(page).to have_content('LIVING LAB 1')
    expect(page).to have_content('Dashboard')

    # Still lab page (selected lab in cookies)
    visit '/'

    current_url.should end_with '/living-lab-1/dashboard'

    expect(page).to have_content('LIVING LAB 1')
    expect(page).to have_content('Dashboard')
  end
end
