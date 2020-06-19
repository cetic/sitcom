describe 'Registration' do

  it 'signs up a new user and account' do
    visit new_registration_path

    within '.container form#new_registration', :wait => 15 do
      fill_in 'Nom et prénom',  :with => "Nasir bin Olu Dara Jones"
      fill_in 'Email',          :with => "nas@defjam.com"
      fill_in 'Mot de passe',   :with => 'dumbpassword'
      fill_in 'Confirmation',   :with => 'dumbpassword'

      fill_in 'Nom du compte', :with => "Def Jam Records"
      fill_in 'Numéro de TVA', :with => "BE42"
      fill_in 'Adresse',       :with => "Rue du puits"
      fill_in 'Localité',      :with => "Bruxelles"
      fill_in 'Code postal',   :with => "1000"
      fill_in 'Pays',          :with => "Belgique"

      click_button 'Créer un compte'
    end

    within '.alert' do
      expect(page).to have_content("Votre compte a été créé.")
    end

    lab = Lab.find_by(name: "Def Jam Records")

    expect(lab).to                  be_present
    expect(lab.account_type).to     eq("basic")
    expect(lab.users.first.name).to eq("Nasir bin Olu Dara Jones")
  end

end
