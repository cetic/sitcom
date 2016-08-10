module CommonIndexConcern

  SETTINGS_HASH = {
    :analysis => {
      :analyzer => {
        :custom_whitespace => {
          :tokenizer => 'whitespace',
          :filter    => ['standard', 'lowercase']
        },

        :custom_msgctxt => {
          :tokenizer => 'msgctxt_tokenizer',
          :filter    => ['lowercase']
        }
      },

      # Special tokenizer because of this: http://stackoverflow.com/questions/24066108/short-queries-return-not-enough-results
      # (increasing max_expansion from 50 to 1024 was not enough and it was the maximum => max 1024 by key)
      :tokenizer => {
        :msgctxt_tokenizer => {
          :type        => 'nGram',
          :min_gram    => 1,
          :max_gram    => 1,
          :token_chars => [ "letter", "digit", "whitespace", "punctuation", "symbol" ]
        }
      }
    }
  }

end
