module CommonIndexConcern

  SETTINGS_HASH = {
    :analysis => {
      :analyzer => {
        :custom_each_char => {
          :type      => 'custom',
          :tokenizer => 'each_char_tokenizer',
          :filter    => ['lowercase']
        }
      },
      # Special tokenizer also because of this: https://stackoverflow.com/questions/24066108/short-queries-return-not-enough-results
      :tokenizer => {
        :each_char_tokenizer => {
          :type        => 'nGram',
          :min_gram    => 1,
          :max_gram    => 1,
          :token_chars => [ "letter", "digit", "whitespace", "punctuation", "symbol" ]
        }
      }
    }
  }
end
