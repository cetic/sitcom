module ApplicationHelper
  def fa(name, suffix = nil)
    if suffix.present?
      "#{content_tag(:i, '', :class => "fa fa-#{name}")}&nbsp;#{suffix}".html_safe
    else
      content_tag(:i, '', :class => "fa fa-#{name}")
    end
  end

  def admin_page?
    params[:controller].split('/').first == 'admin'
  end

  def display_header?
    current_user && params[:controller] != 'passwords'
  end
end
