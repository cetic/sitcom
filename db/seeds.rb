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

jules = User.create!({
  :name                  => 'Jules Verne',
  :email                 => 'jules.verne@hotmail.com',
  :password              => 'testtest42',
  :password_confirmation => 'testtest42',
  :admin                 => false
})
