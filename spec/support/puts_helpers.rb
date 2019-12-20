# See here: https://stackoverflow.com/a/16363159/1243212

module PutsHelpers
  def gray_with_red_bg(text)
    "\e[41m\e[37m#{text}\e[0m\e[0m"
  end

  def red_with_gray_bg(text)
    "\e[47m\e[31m#{text}\e[0m\e[0m"
  end

  def cyan(text)
    "\e[36m#{text}\e[0m"
  end
end
