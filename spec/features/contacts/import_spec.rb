describe 'Contacts import' do

  before :each do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    Contact.__elasticsearch__.refresh_index!

    login_as @user
  end

  it 'imports an XLSX file', js: true do
    visit new_lab_item_import_path(@lab, :item_type => 'contact')

    expect(page).to have_content('Vous pouvez importer un ensemble de contacts')

    click_button 'Analyser le fichier'

    expect(page).to have_content("Vous n'avez pas sélectionné de fichier.")
  end

  it 'imports an XLSX file' do
    xlsx_data = File.read("#{Rails.root}/spec/support/import/contact-import.xlsx")

    import = ContactImport.new(@lab, xlsx_data)

    import.parse
    import.commit

    expect(import.errors.length).to eq(0)
    expect(@lab.contacts.length).to eq(2)
    expect(@lab.contacts.map(&:name)).to eq(['John Doe', 'Albert Dupond'])
  end

end
