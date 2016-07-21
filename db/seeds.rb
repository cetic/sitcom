# Users

aurels = User.create!({
  :name                  => 'Aurélien Malisart',
  :email                 => 'aurelien@phonoid.com',
  :password              => 'testtest42',
  :password_confirmation => 'testtest42',
  :admin                 => true
})

michael = User.create!({
  :name                  => 'Michaël Hoste',
  :email                 => 'michael.hoste@gmail.com',
  :password              => 'testtest42',
  :password_confirmation => 'testtest42',
  :admin                 => true
})

nicolas = User.create!({
  :name                  => 'Nicolas Devos',
  :email                 => 'nicolas.devos@cetic.be ',
  :password              => 'testtest42',
  :password_confirmation => 'testtest42',
  :admin                 => true
})

# Labs

Lab.create(:name => 'Smart Gastronomy')
Lab.create(:name => 'e-Health')
