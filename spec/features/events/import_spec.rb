describe 'Events import' do

  before :each do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    Event.__elasticsearch__.refresh_index!

    login_as @user
  end

  it 'imports an XLSX file', js: true do
    visit new_lab_item_import_path(@lab, :item_type => 'event')

    expect(page).to have_content("Vous pouvez importer un ensemble d'évènements")

    click_button 'Analyser le fichier'

    expect(page).to have_content("Vous n'avez pas sélectionné de fichier.")
  end

  it 'imports an XLSX file' do
    xlsx_data = File.read("#{Rails.root}/spec/support/import/event-import.xlsx")

    import = EventImport.new(@lab, xlsx_data)

    import.parse
    import.commit

    expect(import.errors.length).to eq(0)
    expect(@lab.events.length).to eq(2)
    expect(@lab.events.map(&:name)).to eq(["Vernissage de l'exposition", "Rassemblement des partenaires"])
  end

end
