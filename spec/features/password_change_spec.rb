describe 'Password change' do

  before :each do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab], :password => 'oldpassword')

    login_as @user
  end

  it 'provides a link to the password change page' do
    visit lab_path(@lab)

    within 'ul.navbar-nav li.dropdown' do
      find('a', :text => @user.name).click
      click_link 'Modifier le mot de passe'
    end

    find('h1').text.should == 'Modifier le mot de passe'
  end

  it 'forces the current password to be filled' do
    visit '/profile/password/edit'

    click_button 'Enregistrer'

    find('div.alert').text.should match('Veuillez entrer votre mot de passe actuel.')
  end

  it 'allows password to be changed through the form' do
    visit '/profile/password/edit'

    fill_in 'Mot de passe actuel',  :with => 'oldpassword'
    fill_in 'Nouveau mot de passe', :with => 'newpassword'
    fill_in 'Confirmation',         :with => 'newpassword'

    click_button 'Enregistrer'

    @user.reload

    @user.valid_password?('newpassword').should == true
  end

end
