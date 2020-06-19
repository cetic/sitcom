describe 'Password reset' do
  it 'provides a link to ask for a password reset' do
    visit new_user_session_path

    click_link 'Mot de passe perdu ?'

    expect(page).to have_content('Mot de passe oublié ?')
  end

  it 'provides a working form to ask for a password reset email and reset it' do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    # Check that form works

    visit '/users/password/new'

    within '.container form#new_user' do
      fill_in 'Email', :with => @user.email

      click_button 'Recevoir les instructions par email'
    end

    expect(page).to have_content('Vous allez recevoir sous quelques minutes un courriel vous indiquant comment réinitialiser votre mot de passe.')

    # Check that email is sent with correct link

    open_last_email
    current_email.should have_subject('Instructions pour changer le mot de passe')
    current_email.should deliver_to(@user.email)
    click_email_link_matching(/password\/edit/)

    find('h1').text.should == 'Réinitialiser mon mot de passe'

    within '.container form#new_user' do
      fill_in 'Nouveau mot de passe',              :with => 'newpassword'
      fill_in 'Confirmer le nouveau mot de passe', :with => 'newpassword'

      click_button 'Valider'
    end

    # Page of lab selection (correctly logged!)
    expect(page).to have_content('Comptes')
    expect(page).to have_content(@lab.name)
  end
end
