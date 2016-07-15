module ApplicationHelper
  def f_date(date, over = false)
    content = localize(date, :format => '%d/%m/%Y')
    over ? content_tag(:span, content, { style: 'color:red' }) : content
  end

  def f_date_without_year(date, over = false)
    localize(date, :format => '%d/%m')
  end

  def fa(name, suffix = nil)
    if suffix.present?
      "#{content_tag(:i, '', :class => "fa fa-#{name}")}&nbsp;#{suffix}".html_safe
    else
      content_tag(:i, '', :class => "fa fa-#{name}")
    end
  end
end
