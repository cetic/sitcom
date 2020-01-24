describe 'Contacts export' do

  before :each do
    DownloadHelpers.clear_downloads

    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    contact1 = FactoryBot.create(:contact, :lab => @lab, :first_name => 'Indiana', :last_name => 'Jones')
    contact2 = FactoryBot.create(:contact, :lab => @lab, :first_name => 'Michael', :last_name => 'Corleone')

    organization1 = FactoryBot.create(:organization, :lab => @lab, :name => 'Shell')
    organization2 = FactoryBot.create(:organization, :lab => @lab, :name => 'Q8')

    event1 = FactoryBot.create(:event, :lab => @lab, :name => 'Bidule')
    event2 = FactoryBot.create(:event, :lab => @lab, :name => 'Machin')

    project1 = FactoryBot.create(:project, :lab => @lab, :name => 'Projet A')
    project2 = FactoryBot.create(:project, :lab => @lab, :name => 'Projet B')

    ContactOrganizationLink.create(:contact_id => contact2.id, :organization_id => organization1.id)
    ContactOrganizationLink.create(:contact_id => contact2.id, :organization_id => organization2.id)

    ContactEventLink.create(:contact_id => contact2.id, :event_id => event1.id)
    ContactEventLink.create(:contact_id => contact2.id, :event_id => event2.id)

    ContactProjectLink.create(:contact_id => contact2.id, :project_id => project1.id)
    ContactProjectLink.create(:contact_id => contact2.id, :project_id => project2.id)

    FactoryBot.create(:note, :notable => contact1, :privacy => :public,  :text => 'bla bla')

    Contact.__elasticsearch__.refresh_index!

    login_as @user
  end

  it 'exports an XLSX file', js: true do
    visit lab_path(@lab)

    within '.quick-search' do
      new_window = window_opened_by do
        find('.fa-file-excel-o').click
      end

      within_window new_window do
        expect(File.basename(DownloadHelpers.download_path)).to eq("contacts.xlsx")

        xlsx_data = File.read(DownloadHelpers.download_path)
        workbook  = RubyXL::Parser.parse_buffer(xlsx_data)
        worksheet = workbook.worksheets[0]

        expect(worksheet[1][ 0].value).to eq("Michael")
        expect(worksheet[1][ 1].value).to eq("Corleone")
        expect(worksheet[1][12].value).to eq("Shell, Q8")
        expect(worksheet[1][13].value).to eq("Projet A, Projet B")
        expect(worksheet[1][14].value).to eq("Bidule, Machin")

        expect(worksheet[2][ 0].value).to eq("Indiana")
        expect(worksheet[2][ 1].value).to eq("Jones")
        expect(worksheet[2][16].value).to eq(" — bla bla")
      end
    end
  end

end
