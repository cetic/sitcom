aurels = User.create!({
  :name                  => 'Aurélien Malisart',
  :email                 => 'aurelien@phonoid.com',
  :password              => 'testtest42',
  :password_confirmation => 'testtest42'
})

michael = User.create!({
  :name                  => 'Michaël Hoste',
  :email                 => 'michael.hoste@gmail.com',
  :password              => 'testtest42',
  :password_confirmation => 'testtest42'
})

nicolas = User.create!({
  :name                  => 'Nicolas Devos',
  :email                 => 'nicolas.devos@cetic.be ',
  :password              => 'testtest42',
  :password_confirmation => 'testtest42'
})
