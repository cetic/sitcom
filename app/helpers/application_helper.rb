module ApplicationHelper
  def fa(name, suffix = nil, title = nil)
    if suffix.present?
      "#{content_tag(:i, '', { :class => "fa fa-#{name}", :title => title })}&nbsp;#{suffix}".html_safe
    else
      content_tag(:i, '', {
        :class => "fa fa-#{name}",
        :title => title
      })
    end
  end

  def admin_page?
    params[:controller].split('/').first == 'admin'
  end

  def display_header?
    current_user &&
      params[:controller] != 'passwords' &&
      !(params[:controller] == 'labs' && params[:action] == 'index')
  end
end
