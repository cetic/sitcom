module CommonIndexConcern

  SETTINGS_HASH = {
    :analysis => {
      :analyzer => {
        :sortable_string_analyzer => {
          :type      => 'custom',
          :tokenizer => 'keyword',
          :filter    => ['lowercase', 'asciifolding']
        },
      },
    }
  }

end
