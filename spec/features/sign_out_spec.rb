describe 'Sign out' do
  before :each do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])
  end

  it 'works from menu' do
    login_as @user

    visit lab_path(@lab)

    within 'ul.navbar-nav li.dropdown' do
      find('a', :text => @user.name).click
      click_link 'Se déconnecter'
    end

    expect(page).to have_content('Connexion')
  end
end
