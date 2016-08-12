class PdfDocumentUploader < BasePrivateUploader
  def extension_white_list
    %w(pdf)
  end
end
